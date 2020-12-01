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
  { User, Channel, ChannelSub, ChannelMessage, sequelize, Block }
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

  const channel = await Channel.findOne({ where: { id: cid } });

  if (!sub || !channel) {
    res.json({ response: getText("notSubbed") });
    return;
  }

  const { pathImage, invalid } = saveImageIfValid(res, image, false);
  if (invalid) return;

  if (channel.pmUsers) {
    const user2 = await ChannelSub.findOne({
      where: { channelId: cid, userId: { [Op.ne]: user.id } },
      include: { model: User },
    });

    if (user2.user) {
      const block = await Block.findOne({
        where: { user1id: user2.user.id, user2id: user.id },
      });

      if (block) {
        return res.json({ response: getText("youAreBlocked") });
      }
    }
  }

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
    success: true,
  });
};

module.exports = { getChat, postChat };
