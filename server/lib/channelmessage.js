const {
  saveImageIfValid,
  publicUserFields,
  getTextFunction,
  sendChatPushMail,
} = require("./util");
const { Sequelize, Op } = require("sequelize");

let getText = getTextFunction();

const getChat = async (req, res, { User, ChannelSub, ChannelMessage }) => {
  const { loginToken, id } = req.query;

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

  const isSub = await ChannelSub.findOne({
    where: { channelId: id, userId: user.id },
  });

  if (!isSub) {
    res.json({ response: getText("notSubbed") });
    return;
  }

  const chat = await ChannelMessage.findAll({
    where: { channelId: id },
    order: [["id", "DESC"]],
    include: { model: User, attributes: publicUserFields },
    limit: 100,
  });

  res.json({ chat });
};

const postChat = async (
  req,
  res,
  { User, Channel, ChannelSub, ChannelMessage, sequelize }
) => {
  const { loginToken, cid, message, image } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!message) {
    res.json({ response: getText("noMessage") });
    return;
  }

  if (!cid) {
    res.json({ response: getText("noChannelId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const sub = await ChannelSub.findOne({
    where: { channelId: cid, userId: user.id },
  });

  if (!sub) {
    res.json({ response: getText("notSubbed") });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  sendChatPushMail({
    // models
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    // other info
    channelId: cid,
    message,
    pathImage,
    user1: user,
    gang: undefined,
    isSystem: false,
    user2: undefined,
  });

  res.json({
    response: getText("postChatSuccess"),
    success: true,
  });
};

module.exports = { getChat, postChat };
