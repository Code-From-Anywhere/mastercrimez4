const { Op, Sequelize } = require("sequelize");
const {
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  sendChatPushMail,
} = require("./util");

let getText = getTextFunction();

const jail = async (req, res, User) => {
  const people = await User.findAll({
    attributes: ["name", "jailAt"],
    where: { jailAt: { [Op.gt]: Date.now() } },
  });

  res.json({ jail: people });
};

const breakout = async (
  req,
  res,
  { User, Channel, ChannelMessage, ChannelSub, Action }
) => {
  const { token, name, captcha } = req.body;

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

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  // if (user.needCaptcha && Number(captcha) !== user.captcha) {
  //   return res.json({ response: "Verkeerde code!" });
  // }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
  }

  const user2 = await User.findOne({ where: { name } });

  if (!user2) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  if (user2.jailAt < Date.now()) {
    res.json({ response: getText("userNotInJail", user2.name) });
    return;
  }

  const random = Math.round(Math.random() * 100);

  Action.create({
    userId: user.id,
    action: "breakout",
    timestamp: Date.now(),
  });

  if (random < 50) {
    const seconds = 45;

    res.json({
      response: getText("jailFail", seconds),
    });

    User.update(
      {
        // captcha: null,
        // needCaptcha: needCaptcha(),
        onlineAt: Date.now(),
        numActions: Sequelize.literal(`numActions+1`),
        jailAt: Date.now() + seconds * 1000,
      },
      { where: { id: user.id } }
    );
  } else {
    res.json({
      response: getText("breakoutSuccess", user2.name),
    });

    User.update(
      {
        // captcha: null,
        // needCaptcha: needCaptcha(),
        onlineAt: Date.now(),
        numActions: Sequelize.literal(`numActions+1`),
        rank: Sequelize.literal(`rank + 10`),
      },
      { where: { id: user.id } }
    );

    const getUserText = getTextFunction(user2.locale);

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getUserText("breakoutMessage", user.name),
      user1: user,
      user2,
    });

    User.update({ jailAt: null }, { where: { id: user2.id } });
  }
};

const buyout = async (req, res, User, City, Action) => {
  const { token, type } = req.body; //type = cash or credits

  if (type !== "cash" && type !== "credits") {
    return res.json({ response: getText("invalidType") });
  }
  const creditPrice = 5;
  const cashPrice = 1000000;

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

  if (user.jailAt < Date.now()) {
    res.json({ response: getText("youreNotInJail") });
    return;
  }

  const price = type === "cash" ? cashPrice : creditPrice;

  const [updated] = await User.update(
    {
      jailAt: null,
      [type]: Sequelize.literal(`${type}-${price}`),
      onlineAt: Date.now(),
    },
    { where: { id: user.id, [type]: { [Op.gte]: price } } }
  );

  if (updated === 0) {
    return res.json({ response: getText("notEnoughType", type) });
  }

  Action.create({
    userId: user.id,
    action: "buyout",
    timestamp: Date.now(),
  });

  if (type === "cash") {
    const [cityUpdated] = await City.update(
      { jailProfit: Sequelize.literal(`jailProfit+${price * 0.5}`) },
      { where: { city: user.city } }
    );
  }

  return res.json({ response: getText("buyoutSuccess") });
};

module.exports = { jail, breakout, buyout };
