const { Op, Sequelize } = require("sequelize");
const { needCaptcha, sendMessageAndPush } = require("./util");

const typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Huisjesmelker",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  rld: "Red light district",
  airport: "Vliegveld",
  estateAgent: "Makelaarskantoor",
  bank: "Zwitserse Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const bomb = async (req, res, sequelize, User, City, Message) => {
  let { loginToken, bombs, type, captcha } = req.body;

  bombs = Math.round(Number(bombs));

  if (isNaN(bombs) || bombs <= 0) {
    return res.json({ response: "Dat is geen geldig aantal" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  if (!Object.keys(typeStrings).includes(type)) {
    return res.json({ response: "Ongeldig type" });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.bombAt + 300000 > Date.now()) {
    return res.json({
      response: `Je moet nog ${Math.round(
        (user.bombAt + 300000 - Date.now()) / 1000
      )} seconden wachten voor je weer kan bombarderen`,
    });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: "Verkeerde code!" });
  }

  const city = await City.findOne({ where: { city: user.city } });

  if (!city) {
    return res.json({ response: "Stad niet gevonden" });
  }

  if (bombs > user.airplane * 5) {
    return res.json({
      response: "Zoveel bommen kan je niet werpen met dit vliegtuig",
    });
  }

  const price = 50000 * bombs;

  if (price > user.cash) {
    res.json({ response: "Je hebt niet genoeg geld contant" });
    return;
  }

  const stolenMoney = Math.round(
    city[`${type}Profit`] * Math.random() * (bombs / 100)
  );
  let damage = Math.round(Math.random() * bombs * 2);
  damage =
    damage > 100 - city[`${type}Damage`] ? 100 - city[`${type}Damage`] : damage;

  const [updated] = await User.update(
    {
      captcha: null,
      needCaptcha: needCaptcha(),
      cash: user.cash - price + stolenMoney,
      bombAt: Date.now(),
    },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (!updated) {
    return res.json({ response: "Er ging iets fout" });
  }

  await City.update(
    {
      [`${type}Profit`]: Sequelize.literal(`${type}Profit - ${stolenMoney}`),
      [`${type}Damage`]: Sequelize.literal(`${type}Damage + ${damage}`),
    },
    { where: { city: city.city } }
  );

  let extraText = "";
  let extraMessage = "";
  if (city[`${type}Damage`] + damage === 100) {
    extraText = `Je hebt de ${typeStrings[type]} overgenomen!`;
    extraMessage = `${user.name} heeft jouw ${typeStrings[type]} overgenomen!`;
    City.update(
      {
        [`${type}Owner`]: user.name,
        [`${type}Damage`]: 0,
      },
      { where: { city: city.city } }
    );
  }

  if (city[`${type}Owner`]) {
    const user2 = await User.findOne({ where: { name: city[`${type}Owner`] } });
    if (user2) {
      sendMessageAndPush(
        user,
        user2,
        `${user.name} gooide ${bombs} bommen op jouw ${typeStrings[type]} in ${city.city}. Dit heeft jouw ${typeStrings[type]} ${damage}% schade aangebracht, ook stal ${user.name} €${stolenMoney},-. ${extraMessage}`,
        Message,
        true
      );
    }
  }
  //
  res.json({
    response: `Je gooide ${bombs} bommen op de ${typeStrings[type]} van ${
      city.city
    } van ${
      city[`${type}Owner`]
    }. Je bracht hiermee ${damage}% schade aan, en stal €${stolenMoney},-. ${extraText}`,
  });
};

module.exports = { bomb };
