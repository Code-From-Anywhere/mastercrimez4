const {
  getRank,
  getStrength,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  sendChatPushMail,
} = require("./util");
const { Sequelize, Op } = require("sequelize");

let getText = getTextFunction();

const SECONDS = 30;

const rob = async (
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

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
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
    res.json({ response: getText("personDoesntExist") });
    return;
  }

  if (user2.name === user.name) {
    res.json({ response: getText("thatsYourself") });
    return;
  }

  if (user.robAt + SECONDS * 1000 > Date.now()) {
    res.json({
      response: getText("robWait"),
    });
    return;
  }

  if (user2.robbedAt + SECONDS * 1000 > Date.now()) {
    res.json({ response: getText("robPersonAlreadyRobbed") });
    return;
  }

  if (user2.bunkerAt > Date.now()) {
    res.json({ response: getText("robPersonBunker") });
    return;
  }

  if (user.bunkerAt > Date.now()) {
    res.json({ response: getText("robYoureInBunker") });
    return;
  }

  const stealAmount = Math.round(Math.random() * user2.cash);

  const meRank =
    getRank(user.rank, "number") + getStrength(user.strength, "number");
  const heRank =
    getRank(user2.rank, "number") + getStrength(user2.strength, "number");
  const probability = (meRank / heRank) * 30;
  const random = Math.round(Math.random() * 100);

  const now = Date.now();
  User.update({ robbedAt: now }, { where: { id: user2.id } });

  Action.create({
    userId: user.id,
    action: "rob",
    timestamp: Date.now(),
  });

  if (probability < random) {
    res.json({ response: getText("fail") });
    User.update(
      {
        robAt: now,
        onlineAt: Date.now(),
        captcha: null,
        needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
      },
      {
        where: { id: user.id, robAt: { [Op.lt]: Date.now() - SECONDS * 1000 } },
      }
    );

    return;
  }

  const [gelukt] = await User.update(
    { cash: user2.cash - stealAmount },
    { where: { id: user2.id, cash: { [Op.gte]: stealAmount } } }
  );

  if (gelukt) {
    const [gelukt2] = await User.update(
      {
        cash: user.cash + stealAmount,
        robAt: now,
        captcha: null,
        needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
      },
      { where: { id: user.id, robAt: { [Op.lte]: now - SECONDS * 1000 } } }
    );

    if (gelukt2) {
      const getUserText = getTextFunction(user2.locale);

      sendChatPushMail({
        Channel,
        ChannelMessage,
        ChannelSub,
        User,
        isSystem: true,
        message: getUserText("robMessage", user.name, stealAmount),
        user1: user,
        user2,
      });

      return res.json({
        response: getText("robSuccess", stealAmount),
      });
    }

    // console.log("gelukt", gelukt, "gelukt2", gelukt2);
  }
  return res.json({ response: getText("somethingWentWrong") });
};

module.exports = { rob };
