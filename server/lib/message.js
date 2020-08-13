const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const message = async (req, res, User, Message) => {
  const { token, to, message } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", to)
      ),
    },
  });

  if (!user2) {
    res.json({ response: "Die persoon bestaat niet" });
    return;
  }

  sendMessageAndPush(user, user2, message, Message);

  res.json({ response: "Bericht verzonden" });
};

const messages = async (req, res, User, Message) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const allMessages = await Message.findAll({
    where: { to: user.id },
    order: [
      ["read", "asc"],
      ["createdAt", "desc"],
    ],
  });

  res.json({ response: "Success", messages: allMessages });
};

const readMessage = async (req, res, User, Message) => {
  const { token, id } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  Message.update({ read: true }, { where: { id, to: user.id } });

  res.json({ response: "Success" });
};

const deleteMessage = async (req, res, User, Message) => {
  const { token, id } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const mess = await Message.findOne({ where: { id, to: user.id } });
  mess.destroy();

  res.json({ response: "Success" });
};

module.exports = { message, messages, readMessage, deleteMessage };
