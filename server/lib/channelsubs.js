const { getTextFunction } = require("./util");

let getText = getTextFunction();

const channelsubs = async (req, res, User, ChannelSub, Channel) => {
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

  ChannelSub.findAll({
    where: { userId: user.id, isDeleted: null }, //
    include: {
      model: Channel,
      include: {
        model: ChannelSub,
        attributes: ["id", "userId"],
        include: { model: User, attributes: ["id", "name", "thumbnail"] },
      },
    },
    order: [["lastmessageDate", "DESC"]],
  }).then((subs) => {
    res.json(subs);
  });
};

const pm = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken, userId } = req.query;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!userId || isNaN(userId)) {
    res.json({ response: getText("noId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const user2 = await User.findOne({ where: { id: userId } });

  if (!user2) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const smallest = user.id < userId ? user.id : userId;
  const biggest = user.id > userId ? user.id : userId;
  const pmUsers = `[${smallest}][${biggest}]`;

  const already = await Channel.findOne({ where: { pmUsers } });

  if (already) {
    return res.json({ id: already.id });
  }

  // if there isn't,create it
  const newChannel = await Channel.create({ pmUsers });
  ChannelSub.create({ channelId: newChannel.id, userId: user.id });
  ChannelSub.create({ channelId: newChannel.id, userId: userId });

  return res.json({ id: newChannel.id });
};

const setRead = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken, id } = req.body;
  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!id || isNaN(id)) {
    res.json({ response: getText("noId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const [updated] = await ChannelSub.update(
    { unread: 0 },
    { where: { id, userId: user.id } }
  );
  return res.json({ success: true });
};

const setDeleted = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken, id } = req.body;
  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!id || isNaN(id)) {
    res.json({ response: getText("noId") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const [updated] = await ChannelSub.update(
    { isDeleted: true, unread: 0 },
    { where: { id, userId: user.id } }
  );

  return res.json({ success: updated === 1 });
};

const deleteAll = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken } = req.body;
  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const [updated] = await ChannelSub.update(
    { isDeleted: true, unread: 0 },
    { where: { userId: user.id, isDeleted: null } }
  );

  return res.json({ success: updated > 0 });
};

module.exports = { channelsubs, pm, setRead, setDeleted, deleteAll };
