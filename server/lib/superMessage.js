const { Op } = require("sequelize");
const { getTextFunction, sendChatPushMail } = require("./util");

let getText = getTextFunction();

const PRICE = 500;

const superMessage = async (
  req,
  res,
  { User, Channel, ChannelMessage, ChannelSub, ScheduledMessage }
) => {
  const { token, message, date } = req.body;

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

  if (user.credits < PRICE) {
    res.json({ response: getText("notEnoughCredits") });
    return;
  }

  if (!message) {
    res.json({ response: getText("superMessageNo") });
    return;
  }

  const [updated] = await User.update(
    { credits: user.credits - PRICE },
    { where: { loginToken: token, credits: { [Op.gte]: PRICE } } }
  );
  if (!updated) {
    return res.json({ response: getText("notEnoughCredits") });
  }

  if (date && user.level === 10) {
    ScheduledMessage.create({
      date: date,
      message,
      userId: user.id,
    });
    res.json({ response: getText("success") });
  } else {
    const to = await User.findAll({ where: { phoneVerified: true } });

    if (to) {
      to.forEach((user2) => {
        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          isSystem: false,
          message,
          user1: user,
          user2,
        });
      });
    }

    res.json({ response: getText("success") });
  }
};

const scheduled = async (
  req,
  res,
  { User, Channel, ChannelMessage, ChannelSub, ScheduledMessage }
) => {
  const { token } = req.query;

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

  if (user.level !== 10) {
    return res.json({ response: getText("noAccess") });
  }

  const messages = await ScheduledMessage.findAll({ order: [["date", "ASC"]] });
  return res.json({ scheduled: messages });
};

const updateScheduled = async (req, res, { User, ScheduledMessage }) => {
  const { token, id, message, date } = req.body;

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

  if (user.level !== 10) {
    return res.json({ response: getText("noAccess") });
  }

  if (!id || !message || !date) {
    return res.json({ response: getText("invalidValues") });
  }

  ScheduledMessage.update({ message, date }, { where: { id } });
  return res.json({ response: getText("success") });
};

module.exports = { superMessage, scheduled, updateScheduled };
