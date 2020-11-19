const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const { sendMessageAndPush, getTextFunction } = require("./util");

let getText = getTextFunction();

const message = async (req, res, User, Message, Action) => {
  const { token, to, message } = req.body;

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

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", to)
      ),
    },
  });

  if (!user2) {
    res.json({ response: getText("personDoesntExist") });
    return;
  }

  Action.create({
    userId: user.id,
    action: "message",
    timestamp: Date.now(),
  });

  sendMessageAndPush(user, user2, message, Message);

  res.json({ response: getText("messageSent") });
};

const messages = async (req, res, User, Message) => {
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

  const allMessages = await Message.findAll({
    where: { to: user.id },
    order: [
      ["read", "asc"],
      ["createdAt", "desc"],
    ],
  });

  res.json({ response: getText("success"), messages: allMessages });
};

const readMessage = async (req, res, User, Message) => {
  const { token, id } = req.body;

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

  Message.update({ read: true }, { where: { id, to: user.id } });

  res.json({ response: getText("success") });
};

const deleteMessage = async (req, res, User, Message) => {
  const { token, id } = req.body;

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

  const mess = await Message.findOne({ where: { id, to: user.id } });
  mess.destroy();

  res.json({ response: getText("success") });
};

module.exports = { message, messages, readMessage, deleteMessage };
