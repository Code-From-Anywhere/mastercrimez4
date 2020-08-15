const { getRank, getStrength, sendMessageAndPush } = require("./util");
const { Sequelize, Op } = require("sequelize");

const properties = [
  "bulletFactory",
  "casino",
  "rld",
  "landlord",
  "junkies",
  "weaponShop",
  "airport",
  "estateAgent",
  "garage",
  "jail",
  "bank",
];

const SECONDS = 120;

const kill = async (req, res, User, Message, Garage, City) => {
  const { token, name, bullets } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  if (bullets < 0 || isNaN(bullets)) {
    res.json({ response: "Ongeldig aantal kogels" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified) {
    return res.json({ response: "Je moet je account eerst verifiëren!" });
  }

  if (user.bullets < Number(bullets)) {
    res.json({ response: "Je hebt niet genoeg kogels" });
    return;
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", name)
      ),
    },
  });

  if (!user2) {
    res.json({ response: "Die persoon bestaat niet" });
    return;
  }

  if (user2.name === user.name) {
    res.json({ response: "Dat ben je zelf!" });
    return;
  }

  if (user2.health <= 0) {
    res.json({ response: `${user2.name} is al dood` });
    return;
  }

  if (user.attackAt + SECONDS * 1000 > Date.now()) {
    res.json({
      response: "Je moet nog even wachten voor je weer iemand kan aanvallen",
    });
    return;
  }

  if (user2.attackedAt + SECONDS * 1000 > Date.now()) {
    res.json({ response: "Deze persoon is net ook al aangevallen" });
    return;
  }

  if (user.protectionAt > Date.now()) {
    res.json({ response: "Je staat onder bescherming" });
    return;
  }

  if (user2.protectionAt > Date.now()) {
    res.json({ response: "Deze persoon staat onder bescherming" });
    return;
  }

  if (user2.bunkerAt > Date.now()) {
    res.json({ response: "Deze persoon zit in de schuilkelder" });
    return;
  }

  if (user.bunkerAt > Date.now()) {
    res.json({ response: "Vanuit de schuilkelder kan je niemand aanvallen" });
    return;
  }

  const [canAttack] = await User.update(
    { attackAt: Date.now() },
    {
      where: {
        id: user.id,
        attackAt: { [Op.lt]: Date.now() - SECONDS * 1000 },
      },
    }
  );

  if (!canAttack) {
    // NB: this prevents the spam bug!
    return res.json({
      response: "Je moet nog even wachten voor je weer iemand kan aanvallen.",
    });
  }

  if (user2.city !== user.city) {
    res.json({ response: `${user2.name} is in een andere stad` });
    return;
  }

  const meRank =
    getRank(user.rank, "number") +
    getStrength(user.strength, "number") +
    user.weapon;
  const heRank =
    getRank(user2.rank, "number") +
    getStrength(user2.strength, "number") +
    user2.protection;

  const bulletsNeeded = Math.round(
    Math.sqrt(heRank / meRank) * 50000 * getRank(user2.rank, "number")
  );

  const backfireBulletsNeeded = Math.round(
    Math.sqrt(meRank / heRank) * 50000 * getRank(user.rank, "number")
  );

  let bulletsBackfire = Math.round(user2.backfire * user2.bullets);
  bulletsBackfire =
    bulletsBackfire > bullets * 2 ? bullets * 2 : bulletsBackfire;

  const damage = Math.round((Number(bullets) / bulletsNeeded) * 100);
  let damageBackfire = Math.round(
    (Number(bulletsBackfire) / backfireBulletsNeeded) * 100
  );
  damageBackfire = damageBackfire > user.health ? user.health : damageBackfire;

  let responseBackfire;
  let responseMessageBackfire;

  if (damageBackfire >= user.health) {
    responseBackfire = `${user2.name} schoot terug met ${user2.bullets} kogels. Jij ging dood van de schoten.`;
    responseMessageBackfire = `Met je backfire van ${user2.bullets} kogels heb je ${user.name} doodgeschoten!`;

    User.update(
      {
        cash: 0,
        health: 0,
        bank: 0,
        bullets: 0,
        rank: Math.round(user.rank / 2),
        strength: Math.round(user.strength / 2),
        hoeren: Math.round(user.hoeren / 2),
        junkies: Math.round(user.junkies / 2),
        wiet: Math.round(user.wiet / 2),
        home: 0,
        weapon: 0,
        protection: 0,
        airplane: 0,
        garage: 0,
      },
      { where: { id: user.id } }
    );

    properties
      .map((p) => `${p}Owner`)
      .map(async (x) => {
        const [updated] = await City.update(
          { [x]: null },
          { where: { [x]: user.name } }
        );
        return updated;
      });
  } else {
    responseBackfire = `${user2.name} schoot terug met ${user2.bullets} kogels. Dit heeft jou ${damageBackfire}% schade toegebracht.`;
    responseMessageBackfire = `Met je backfire heb je ${user2.name} ${damageBackfire}% schade toegebracht.`;

    User.update(
      { health: user.health - damageBackfire },
      { where: { id: user.id } }
    );
  }

  if (damageBackfire === 0) {
    responseBackfire = "";
    responseMessageBackfire = "";
  }

  User.update(
    { bullets: user.bullets - Number(bullets) },
    { where: { id: user.id } }
  );
  User.update(
    { attackedAt: Date.now(), bullets: user2.bullets - bulletsBackfire },
    { where: { id: user2.id } }
  );

  if (damage >= user2.health) {
    const gamepoints = Math.round(user2.gamepoints * 0.1);
    const money = user2.bank + user2.cash;

    res.json({
      response: `Je schoot met ${bullets} kogels op ${user2.name}. Je hebt ${user2.name} vermoord. Je hebt ${money},- gestolen en ${gamepoints} gamepoints. ${responseBackfire}`,
    });

    User.update(
      {
        cash: user.cash + user2.cash,
        bank: user.bank + user2.bank,
        gamepoints: user.gamepoints + gamepoints,
      },
      { where: { id: user.id } }
    );

    User.update(
      {
        cash: 0,
        health: 0,
        bank: 0,
        bullets: 0,
        rank: Math.round(user2.rank / 2),
        strength: Math.round(user2.strength / 2),
        hoeren: Math.round(user2.hoeren / 2),
        junkies: Math.round(user2.junkies / 2),
        wiet: Math.round(user2.wiet / 2),
        home: 0,
        weapon: 0,
        protection: 0,
        airplane: 0,
        garage: 0,
        gamepoints: user2.gamepoints - gamepoints,
      },
      { where: { id: user2.id } }
    );

    sendMessageAndPush(
      user,
      user2,
      `${user.name} schoot op jou met ${bullets} kogels. ${user.name} heeft je vermoord! ${responseMessageBackfire}`,
      Message,
      true
    );

    properties
      .map((p) => `${p}Owner`)
      .map(async (x) => {
        const [updated] = await City.update(
          { [x]: null },
          { where: { [x]: user2.name } }
        );
        return updated;
      });

    const accomplices = await User.findAll({
      attributes: ["id"],
      where: Sequelize.or(
        { accomplice: user2.name },
        { accomplice2: user2.name },
        { accomplice3: user2.name },
        { accomplice4: user2.name }
      ),
    });

    accomplices.forEach((accomplice) => {
      sendMessageAndPush(
        user,
        accomplice,
        `${user.name} schoot op ${user2.name} met ${bullets} kogels. ${user.name} heeft ${user2.name} vermoord!`,
        Message,
        true
      );
    });
  } else {
    const stolenCash = Math.round((user2.cash * damage) / 100);
    const stolenBank = Math.round((user2.cash * damage) / 100);
    const stolenTotal = stolenCash + stolenBank;

    User.update(
      {
        cash: user2.cash - stolenCash,
        health: user2.health - damage,
        bank: user2.bank - stolenBank,
      },
      { where: { id: user2.id } }
    );

    User.update(
      {
        cash: user.cash + stolenCash,
        bank: user.bank + stolenBank,
      },
      { where: { id: user.id } }
    );

    const accomplices = await User.findAll({
      attributes: ["id"],
      where: Sequelize.or(
        { accomplice: user2.name },
        { accomplice2: user2.name },
        { accomplice3: user2.name },
        { accomplice4: user2.name }
      ),
    });

    accomplices.forEach((accomplice) => {
      sendMessageAndPush(
        user,
        accomplice,
        `${user.name} heeft ${user2.name} aangevallen en heeft ${damage}% schade toegebracht en ${stolenTotal},- gejat!`,
        Message,
        true
      );
    });

    sendMessageAndPush(
      user,
      user2,
      `${user.name} heeft je aangevallen en heeft ${damage}% schade toegebracht en ${stolenTotal},- van je gejat! ${responseBackfire}`,
      Message,
      true
    );

    res.json({
      response: `Je hebt ${damage}% schade toegebracht aan ${user2.name}. Je hebt ${stolenTotal},- gestolen. ${responseMessageBackfire}`,
    });
  }
};

const getalive = async (req, res, User, Message, Garage) => {
  const { token, option } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  if (user.health > 0) {
    res.json({ response: "Je bent niet dood" });

    return;
  }

  User.update(
    { health: 100, protectionAt: Date.now() + 86400000 },
    { where: { id: user.id } }
  );
  res.json({ response: "Je bent levend" });
};

module.exports = { kill, getalive };
