const { Op, Sequelize } = require("sequelize");
const { needCaptcha, sendChatPushMail, getTextFunction } = require("./util");

let getText = getTextFunction();

const bombArea = async (
  req,
  res,
  { User, City, Action, Channel, ChannelMessage, ChannelSub, MapArea }
) => {
  let { loginToken, bombs, captcha, areaId } = req.body;

  bombs = Math.round(Number(bombs));

  if (isNaN(bombs) || bombs <= 0) {
    return res.json({ response: getText("invalidNumber") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    return res.json({ response: getText("invalidUser") });
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

  if (user.bombAt + 60000 > Date.now()) {
    const seconds = Math.round((user.bombAt + 300000 - Date.now()) / 1000);
    return res.json({
      response: getText("waitForBomb", seconds),
    });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  const city = await City.findOne({ where: { city: user.city } });
  const area = await MapArea.findOne({
    where: { id: areaId, city: user.city },
  });

  if (!city) {
    return res.json({ response: getText("cityNotFound") });
  }

  if (!area || area.userId === user.id || !area.userId) {
    return res.json({ response: getText("areaNotFound") });
  }

  const owner = await User.findOne({ where: { id: area.userId } });

  if (!owner) {
    return res.json({ response: getText("somethingWentWrong") });
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

  let damage = Math.round(Math.random() * bombs * 2);

  damage = damage > 100 - area.damage ? 100 - area.damage : damage;

  const [updated] = await User.update(
    {
      captcha: null,
      needCaptcha: needCaptcha(),
      cash: user.cash - price,
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

  await MapArea.update(
    {
      damage: Sequelize.literal(`damage + ${damage}`),
    },
    { where: { city: city.city, id: area.id } }
  );

  let extraText = "";
  let extraMessage = "";
  if (area.damage + damage === 100) {
    extraText = getText("bombExtraText", getText("area"));
    extraMessage = getText("bombExtraMessage", user.name, getText("area"));
    MapArea.update(
      {
        userId: user.id,
        damage: 0,
      },
      { where: { id: area.id } }
    );
  }

  const getUserText = getTextFunction(owner.locale);

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
      getText("area"),
      city.city,
      damage,
      0,
      extraMessage
    ),
    pathImage: undefined,
    user1: user,
    gang: undefined,
    isSystem: true,
    user2: owner,
  });

  //
  res.json({
    response: getText(
      "bombSuccess",
      bombs,
      getText("area"),
      city.city,
      owner.name,
      damage,
      0,
      extraText
    ),
  });
};

module.exports = { bombArea };
