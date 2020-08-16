const channelsubs = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken } = req.query;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  ChannelSub.findAll({
    where: { userId: user.id },
    include: {
      model: Channel,
      include: {
        model: ChannelSub,
        attributes: ["id"],
        include: { model: User, attributes: ["name"] },
      },
    },
  }).then((subs) => {
    res.json(subs);
  });
};

const pm = async (req, res, User, ChannelSub, Channel) => {
  const { loginToken, userId } = req.query;

  if (!loginToken) {
    res.json({ response: "No token" });
    return;
  }

  if (!userId || isNaN(userId)) {
    res.json({ response: "No userId" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const user2 = await User.findOne({ where: { id: userId } });

  if (!user2) {
    res.json({ response: "Invalid user2" });
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

module.exports = { channelsubs, pm };
