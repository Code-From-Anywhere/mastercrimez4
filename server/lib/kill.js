const {
  getRank,
  getStrength,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  sendChatPushMail,
  properties,
} = require("./util");
const { Sequelize, Op } = require("sequelize");

const { removeOffer } = require("./market");
const { doGangMission } = require("./gang");
let getText = getTextFunction();

const SECONDS = 120;

const kill = async (
  req,
  res,
  {
    User,
    Channel,
    ChannelMessage,
    ChannelSub,
    City,
    Action,
    Gang,
    Offer,
    GangMission,
    MapArea,
  }
) => {
  const { token, name, bullets } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (bullets < 0 || isNaN(bullets)) {
    res.json({ response: getText("killInvalidBullets") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
  }

  if (user.bullets < Number(bullets)) {
    res.json({ response: getText("killNotEnoughBullets") });
    return;
  }

  let user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", name)
      ),
    },
  });

  if (!user2) {
    res.json({ response: getText("personDoesntExist") });
    return;
  }

  const meRankNumber = getRank(user.rank, "number");
  const heRankNumber = getRank(user2.rank, "number");

  if (meRankNumber - heRankNumber > 5 || heRankNumber - meRankNumber > 5) {
    return res.json({ response: getText("killRankDifferenceTooBig") });
  }

  if (user2.gangId === user.gangId && user.gangId !== null) {
    return res.json({ response: getText("killSameGang") });
  }

  const getUserText = getTextFunction(user2.locale);

  if (user2.name === user.name) {
    res.json({ response: getText("thatsYourself") });
    return;
  }

  if (user2.health <= 0) {
    res.json({ response: getText("personAlreadyDead", user2.name) });
    return;
  }

  if (user.attackAt + SECONDS * 1000 > Date.now()) {
    res.json({
      response: getText("killWaitSeconds"),
    });
    return;
  }

  if (user2.attackedAt + SECONDS * 1000 > Date.now()) {
    res.json({ response: getText("killPersonJustAttacked") });
    return;
  }

  if (user.protectionAt > Date.now()) {
    res.json({ response: getText("youreUnderProtection") });
    return;
  }

  if (user2.protectionAt > Date.now()) {
    res.json({ response: getText("personUnderProtection") });
    return;
  }

  if (user2.bunkerAt > Date.now()) {
    res.json({ response: getText("personInBunker") });
    return;
  }

  if (user.bunkerAt > Date.now()) {
    res.json({ response: getText("killYoureInBunker") });
    return;
  }

  const [canAttack] = await User.update(
    {
      attackAt: Date.now(),
      onlineAt: Date.now(),
      numActions: Sequelize.literal(`numActions+1`),
    },
    {
      where: {
        id: user.id,
        attackAt: { [Op.lt]: Date.now() - SECONDS * 1000 },
      },
    }
  );

  Action.create({
    userId: user.id,
    action: "kill",
    timestamp: Date.now(),
  });

  if (!canAttack) {
    // NB: this prevents the spam bug!
    return res.json({
      response: getText("killWaitABit"),
    });
  }

  if (user2.city !== user.city) {
    res.json({ response: getText("personAnotherCity", user2.name) });
    return;
  }

  const meRank =
    meRankNumber + getStrength(user.strength, "number") + user.weapon;
  const heRank =
    heRankNumber + getStrength(user2.strength, "number") + user2.protection;

  const killerAdvantage = user.profession === "killer" ? 0.9 : 1;

  const bulletsNeeded = Math.round(
    Math.sqrt(heRank / meRank) *
      50000 *
      getRank(user2.rank, "number") *
      killerAdvantage
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
    Offer.findAll({ where: { userId: user.id } }).then((offers) =>
      offers.map((offer) => removeOffer({ id: offer.id, Offer, User }))
    );

    responseBackfire = getText(
      "killResponseBackfire",
      user2.name,
      bulletsBackfire
    );
    responseMessageBackfire = getText(
      "killResponseMessageBackfire",
      user.name,
      bulletsBackfire
    );

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
      .map((p) => p.name)
      .map((p) => `${p}Owner`)
      .map(async (x) => {
        const [updated] = await City.update(
          { [x]: null },
          { where: { [x]: user.name } }
        );
        return updated;
      });
  } else {
    responseBackfire = getText(
      "killResponseBackfire2",
      user2.name,
      bulletsBackfire,
      damageBackfire
    );
    responseMessageBackfire = getText(
      "killResponseMessageBackfire2",
      user2.name,
      damageBackfire
    );

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
    //user2 gaat dood

    MapArea.update({ userId: null }, { where: { userId: user2.id } });

    doGangMission({ Gang, GangMission, amount: 1, user, what: "kill" });
    const offers = await Offer.findAll({ where: { userId: user2.id } });
    await Promise.all(
      offers.map((offer) => removeOffer({ id: offer.id, Offer, User }))
    );

    //find user2 again because his stuff changed.

    user2 = await User.findOne({ where: { id: user2.id } });

    const gamepoints = Math.round(user2.gamepoints * 0.1);
    const money = user2.bank + user2.cash;

    let amountBulletsStolenGangbank = 0;
    let amountCashStolenGangbank = 0;
    let responseGang = "";
    let responseMessageGang = "";

    if (user2.gangId) {
      const gang = await Gang.findOne({
        where: { id: user2.gangId, isPolice: false },
      });

      if (gang) {
        const MAX_PERCENTAGE_GANGBANK = 0.1;
        const PERCENTAGE_GANG_DEAD = 0.5;
        const gangMembersDead = (
          await User.findAll({ where: { health: 0, gangId: user2.gangId } })
        ).length;
        const gangMembers = await User.findAll({
          where: { gangId: user2.gangId },
        });
        const percentageDead = (gangMembersDead + 1) / gangMembers.length;

        const percentageOfGangBank =
          percentageDead > PERCENTAGE_GANG_DEAD
            ? MAX_PERCENTAGE_GANGBANK
            : Math.round(
                (percentageDead / PERCENTAGE_GANG_DEAD) *
                  MAX_PERCENTAGE_GANGBANK *
                  100
              ) / 100;

        amountCashStolenGangbank = Math.round(gang.bank * percentageOfGangBank);
        amountBulletsStolenGangbank = Math.round(
          gang.bullets * percentageOfGangBank
        );

        responseMessageGang = getText(
          "killGangMessage",
          percentageOfGangBank * 100,
          amountCashStolenGangbank,
          amountBulletsStolenGangbank
        );
        responseGang = getText(
          "killGangSuccess",
          percentageOfGangBank * 100,
          amountCashStolenGangbank,
          amountBulletsStolenGangbank
        );

        Gang.update(
          {
            bank: Sequelize.literal(`bank - ${amountCashStolenGangbank}`),
            bullets: Sequelize.literal(
              `bullets - ${amountBulletsStolenGangbank}`
            ),
          },
          { where: { id: gang.id } }
        );

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          isSystem: true,
          message: getUserText(
            "killSuccessAccompliceMessage",
            user.name,
            user2.name,
            bullets
          ),
          user1: user,
          gang,
        });
      }
    }

    res.json({
      response: getText(
        "killSuccess",
        bullets,
        user2.name,
        money,
        gamepoints,
        responseBackfire,
        responseGang
      ),
    });

    User.update(
      {
        cash: Sequelize.literal(
          `cash + ${user2.cash} + ${user2.bank} + ${amountCashStolenGangbank}`
        ),
        bullets: Sequelize.literal(`bullets +${amountBulletsStolenGangbank}`),
        gamepoints: Sequelize.literal(`gamepoints + ${gamepoints}`),
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

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getUserText(
        "killMessage",
        user.name,
        bullets,
        responseMessageBackfire,
        responseMessageGang
      ),
      user1: user,
      user2,
    });

    properties
      .map((p) => p.name)
      .map((p) => `${p}Owner`)
      .map(async (x) => {
        const [updated] = await City.update(
          { [x]: null },
          { where: { [x]: user2.name } }
        );
        return updated;
      });
  } else {
    //user2 gaat niet dood maar krijgt schade

    const stolenCash = Math.round((user2.cash * damage) / 100);
    const stolenBank = Math.round((user2.bank * damage) / 100);
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

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getUserText(
        "killFailMessage",
        user.name,
        damage,
        stolenTotal,
        responseBackfire
      ),
      user1: user,
      user2,
    });

    res.json({
      response: getText(
        "killFailResponse",
        damage,
        user2.name,
        stolenTotal,
        responseBackfire
      ),
    });
  }
};

const getalive = async (req, res, User, Action) => {
  const { token, option } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.health > 0) {
    res.json({ response: getText("youreNotDead") });

    return;
  }

  Action.create({
    userId: user.id,
    action: "getAlive",
    timestamp: Date.now(),
  });

  User.update(
    {
      canChooseProfession: true,
      health: 100,
      protectionAt: Date.now() + 86400000,
      rankKnow: 0,
    },
    { where: { id: user.id } }
  );
  res.json({ response: getText("youreAlive") });
};

module.exports = { kill, getalive };
