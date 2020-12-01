const {
  saveImageIfValid,
  publicUserFields,
  getTextFunction,
  sendChatPushMail,
} = require("./util");
const { Sequelize, Op } = require("sequelize");

let getText = getTextFunction();

const addBlock = async (req, res, { User, Block }) => {
  const { loginToken, user2id } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!user2id) {
    res.json({ response: getText("noId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const user2 = await User.findOne({ where: { id: user2id } });

  if (!user2) {
    return res.json({ response: getText("personDoesntExist") });
  }

  const already = await Block.findOne({
    where: { user1id: user.id, user2id: user2.id },
  });
  if (already) {
    return res.json({ response: getText("alreadyBlocked") });
  }

  Block.create({ user1id: user.id, user2id: user2.id });
  res.json({
    response: getText("blockSuccess"),
    success: true,
  });
};

const removeBlock = async (req, res, { User, Block }) => {
  const { loginToken, user2id } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!user2id) {
    res.json({ response: getText("noId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const destroyed = await Block.destroy({
    where: { user1id: user.id, user2id: user2id },
  });

  if (!destroyed) {
    return res.json({ response: getText("notBlocked") });
  }

  res.json({
    response: getText("blockRemoveSuccess"),
    success: true,
  });
};

const blocks = async (req, res, { User, Block }) => {
  const { loginToken } = req.query;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const blocks2 = await Block.findAll({
    where: { user1id: user.id },
    include: { model: User, attributes: publicUserFields },
  });

  res.json({
    blocks: blocks2,
  });
};

module.exports = { addBlock, removeBlock, blocks };
