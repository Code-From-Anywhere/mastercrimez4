const { Op, Sequelize } = require("sequelize");
const { needCaptcha, sendChatPushMail, getTextFunction } = require("./util");

let getText = getTextFunction();

let typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Coffeeshop",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  rld: "Sex shop",
  airport: "Vliegveld",
  estateAgent: "Makelaarskantoor",
  bank: "Zwitserse Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const bomb = async (
  req,
  res,
  { User, City, Action, Channel, ChannelMessage, ChannelSub }
) => {
  let { loginToken, bombs, type, captcha } = req.body;

  bombs = Math.round(Number(bombs));

  if (isNaN(bombs) || bombs <= 0) {
    return res.json({ response: getText("invalidNumber") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  if (!Object.keys(typeStrings).includes(type)) {
    return res.json({ response: getText("invalidType") });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  getText = getTextFunction(user.locale);

  typeStrings = {
    bulletFactory: getText("bulletFactory"),
    casino: getText("casino"),
    landlord: getText("landlord"),
    junkies: getText("junkies"),
    weaponShop: getText("weaponShop"),
    rld: getText("rld"),
    airport: getText("airport"),
    estateAgent: getText("estateAgent"),
    bank: getText("bank"),
    jail: getText("jail"),
    garage: getText("garage"),
  };
  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  if (user.bombAt + 300000 > Date.now()) {
    const seconds = Math.round((user.bombAt + 300000 - Date.now()) / 1000);
    return res.json({
      response: getText("waitForBomb", seconds),
    });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  const city = await City.findOne({ where: { city: user.city } });

  if (!city) {
    return res.json({ response: getText("cityNotFound") });
  }

  if (bombs > user.airplane * 5) {
    return res.json({
      response: getText("tooManyBombs"),
    });
  }

  const price = 50000 * bombs;

  if (price > user.cash) {
    res.json({
      response: getText("notEnoughCash", price),
    });
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
      onlineAt: Date.now(),
    },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (!updated) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  Action.create({
    userId: user.id,
    action: "bomb",
    timestamp: Date.now(),
  });

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
    extraText = getText("bombExtraText", typeStrings[type]);
    extraMessage = getText("bombExtraMessage", user.name, typeStrings[type]);
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
      const getUserText = getTextFunction(user2.locale);

      sendChatPushMail({
        // models
        Channel,
        ChannelMessage,
        ChannelSub,
        User,
        // other info
        channelId: undefined,
        message: getUserText(
          "bombMessage",
          user.name,
          bombs,
          typeStrings[type],
          city.city,
          damage,
          stolenMoney,
          extraMessage
        ),
        pathImage: undefined,
        user1: user,
        gang: undefined,
        isSystem: true,
        user2,
      });
    }
  }
  //
  res.json({
    response: getText(
      "bombSuccess",
      bombs,
      typeStrings[type],
      city.city,
      city[`${type}Owner`],
      damage,
      stolenMoney,
      extraText
    ),
  });
};

module.exports = { bomb };
