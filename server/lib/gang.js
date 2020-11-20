const { Op, Sequelize } = require("sequelize/types");
const {
  getTextFunction,
  sendChatPushMail,
  publicUserFields,
} = require("./util");
let getText = getTextFunction();

const GANG_CREATE_COST = 5000000;
const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

const deleteGang = async (
  gang,
  user,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  console.log("delete gang", gang.name);

  const gangObject = await Gang.findOne({ where: { id: gang.id } });

  const allMembers = await User.findAll({ where: { gang: user.gang } });
  User.update({ gang: null, gangLevel: 1 }, { where: { gang: gang.name } });
  //delete all channelsubs and channel
  const gangChannel = await Channel.findAll({ where: { gangName: gang.name } });
  const channelSubs = await ChannelSub.findAll({
    where: { channelId: gangChannel.id },
  });
  gangChannel.destroy();
  channelSubs.destroy();

  const destroyed = await gang.destroy();

  console.log("destroyed", destroyed);

  if (destroyed) {
    const [updatedUser] = await User.update(
      {
        cash: Sequelize.literal(`cash+${gang.bank}`),
        bullets: Sequelize.literal(`bullets+${gang.bullets}`),
      },
      { where: { id: user.id } }
    );
  }
  Action.create({
    userId: user.id,
    action: "gangRemove",
    timestamp: Date.now(),
  });

  allMembers.forEach((member) => {
    const getMemberText = getTextFunction(member.locale);

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getMemberText("gangRemoveMessage", user.name, gang.name),
      user1: user,
      user2: member,
    });
  });
};

/**
 * a user {token} makes a gang with name {name}. A welcome message gets sent
 */
const gangCreate = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, name } = req.body;

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

  if (!name) {
    return res.json({ response: getText("noNameGiven") });
  }

  if (name.length < 3 || name.length > 24) {
    return res.json({ response: getText("nameWrongLength", 3, 24) });
  }

  if (user.gang) {
    return res.json({ response: getText("gangAlready") });
  }

  if (user.cash < GANG_CREATE_COST) {
    return res.json({ response: getText("notEnoughCash", GANG_CREATE_COST) });
  }

  const [updated] = await User.update(
    {
      gang: name,
      gangLevel: GANG_LEVEL_BOSS,
      cash: Sequelize.literal(`cash - ${GANG_CREATE_COST}`),
    },
    { where: { id: user.id } }
  );

  if (!updated) {
    return res.json({ response: getText("couldntUpdateUser") });
  }

  const gang = await Gang.create({ name });

  Action.create({
    userId: user.id,
    action: "createGang",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    gang,
    isSystem: true,
    message: getText("gangWelcomeMessage"),
  });

  res.json({ response: getText("gangCreateSuccess") });
};

/**
 * a user {token} asks to join a gang {name}. a GangRequests is made for this, and a message is sent.
 */
const gangJoin = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
) => {
  const { token, name } = req.body;

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

  if (!name) {
    return res.json({ response: getText("noNameGiven") });
  }

  const gang = await Gang.findOne({ where: { name } });

  if (!gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gang) {
    return res.json({ response: getText("gangAlready") });
  }

  const alreadyRequested = GangRequest.findOne({
    where: { userId: user.id, gangName: gang.name },
  });

  if (alreadyRequested) {
    return res.json({ response: getText("gangAlreadyRequested") });
  }
  Action.create({
    userId: user.id,
    action: "gangJoinRequest",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    gang,
    isSystem: true,
    message: getText("gangJoinRequest", user.name, gang.name),
    user1: user,
  });

  GangRequest.create({ userId: user.id, gangName: gang.name, isInvite: false });

  res.json({ response: getText("gangJoinSuccess", gang.name) });
};

/**
 * A member that's higher than underboss invites a member that's not in the gang yet (name).
 */
const gangInvite = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
) => {
  const { token, name } = req.body;

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

  if (!name) {
    return res.json({ response: getText("noNameGiven") });
  }

  const gang = await Gang.findOne({ where: { name: user.gang } });

  if (!gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
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
    return res.json({ response: getText("personDoesntExist") });
  }

  if (user2.gang) {
    return res.json({ response: getText("personAlreadyInGang") });
  }

  const alreadyRequested = GangRequest.findOne({
    where: { userId: user2.id, gangName: gang.name },
  });

  if (alreadyRequested) {
    return res.json({ response: getText("gangAlreadyInvited") });
  }

  Action.create({
    userId: user.id,
    action: "gangInvite",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangInviteMessage", gang.name),
    user1: user,
    user2: user2,
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangInviteGangMessage", user2.name, gang.name),
    gang,
  });

  GangRequest.create({ userId: user2.id, gangName: gang.name, isInvite: true });

  res.json({ response: getText("gangInviteSuccess", user2.name) });
};

/**
 * A gangmember (that's underboss or higher) accepts or declines a join request of a user that's not in the gang yet.
 * If accepted, the user gets added to the gang
 */
const gangAnswerJoin = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
) => {
  const { token, id, accepted } = req.body;

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

  if (!id) {
    return res.json({ response: getText("noId") });
  }

  const gang = await Gang.findOne({ where: { name: user.gang } });

  if (!gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
  }

  const joinRequest = GangRequest.findOne({
    where: { id, gangName: gang.name },
  });

  if (!joinRequest) {
    return res.json({ response: getText("gangRequestNotFound") });
  }

  const user2 = await User.findOne({
    where: {
      id: joinRequest.userId,
    },
  });

  if (!accepted) {
    joinRequest.destroy();
    return res.json({ response: getText("gangRequestRejected", user2.name) });
  }

  if (!user2) {
    joinRequest.destroy();
    return res.json({ response: getText("personDoesntExist") });
  }

  //remove all other gangrequests , including this one
  const allInvites = GangRequest.findAll({ where: { userId: user2.id } });
  allInvites.destroy();

  Action.create({
    userId: user.id,
    action: "gangAnswerJoin",
    timestamp: Date.now(),
  });
  Gang.update(
    { members: Sequelize.literal(`members+1`) },
    { where: { name: gang.name } }
  );
  User.update({ gang: gang.name }, { where: { id: user2.id } });
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  if (gangChannel) {
    await ChannelSub.create({ channelId: gangChannel.id, userId: user2.id });
  }

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangAnswerJoinMessage", user2.name),
    gang,
  });

  res.json({ response: getText("gangInviteSuccess") });
};

/**
 * a gang member {token} accepts or declines {accepted} an invite {id}
 */
const gangAnswerInvite = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
) => {
  const { token, id, accepted } = req.body;

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

  if (!id) {
    return res.json({ response: getText("noId") });
  }

  const joinRequest = GangRequest.findOne({ where: { id, userId: user.id } });

  if (!joinRequest) {
    return res.json({ response: getText("gangRequestNotFound") });
  }

  const gang = await Gang.findOne({ where: { name: joinRequest.gangName } });

  if (!gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (!accepted) {
    joinRequest.destroy();
    return res.json({ response: getText("gangInviteRejected", gang.name) });
  }

  Action.create({
    userId: user.id,
    action: "gangAnswerInvite",
    timestamp: Date.now(),
  });

  //accpeted, so join

  //remove all other gangrequests , including this one
  const allInvites = GangRequest.findAll({ where: { userId: user.id } });
  allInvites.destroy();

  User.update({ gang: gang.name }, { where: { id: user.id } });
  Gang.update(
    { members: Sequelize.literal(`members+1`) },
    { where: { name: gang.name } }
  );

  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });

  if (gangChannel) {
    await ChannelSub.create({ channelId: gangChannel.id, userId: user.id });
  }

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangAnswerInviteMessage", user.name, gang.name),
    gang,
  });

  res.json({ response: getText("gangAnswerInviteSuccess") });
};

/**
 * a gang member {token} leaves a gang
 */
const gangLeave = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token } = req.body;

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

  const gang = await Gang.findOne({ where: { name: user.gang } });

  if (!gang || !user.gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  //leave gang
  //if you're the only boss, highest other member gets your rank
  //if gang is empty now, delete it (use function for this)

  Gang.update(
    { members: Sequelize.literal(`members-1`) },
    { where: { gang: gang.name } }
  );

  User.update({ gang: null }, { where: { id: user.id } });
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  const channelSub = await ChannelSub.findOne({
    where: { userId: user.id, channelId: gangChannel.id },
  });
  channelSub.destroy();

  if (user.gangLevel === GANG_LEVEL_BOSS) {
    const otherBosses = await User.findAll({
      where: { gang: user.gang, gangLevel: GANG_LEVEL_BOSS },
    });
    if (otherBosses.length === 0) {
      //youre the only boss

      const otherMembers = await User.findAll({
        where: { gang: user.gang, name: { [Op.ne]: user.name } },
        order: [["gangLevel", "DESC"]],
      });

      if (otherMembers.length === 0) {
        //delete gang
        deleteGang(gang, user, { Gang, User });
      } else {
        const [updated] = User.update(
          { gangLevel: GANG_LEVEL_BOSS },
          { where: { name: otherMembers[0].name } }
        );
      }
    }
  }

  Action.create({
    userId: user.id,
    action: "gangLeave",
    timestamp: Date.now(),
  });

  //accpeted, so join

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangLeaveMessage", user.name, gang.name),
    gang,
  });

  res.json({ response: getText("gangLeaveSuccess") });
};

/**
 * a gang member [token] that's allowed (boss,underboss), kicks another gang member that's not himself [userId].
 *
 */
const gangKick = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, userId } = req.body;

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

  const gang = await Gang.findOne({ where: { name: user.gang } });

  if (!gang || !user.gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
  }

  const user2 = await User.findOne({
    where: { id: userId, gang: gang.name, id: { [Op.ne]: user.id } },
  });

  if (!user2) {
    return res.json({ response: getText("gangKickUserNotFound") });
  }

  //all ok. kick

  Gang.update(
    { members: Sequelize.literal(`members-1`) },
    { where: { gang: gang.name } }
  );

  User.update({ gang: null, gangLevel: 1 }, { where: { id: user2.id } });
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  const channelSub = await ChannelSub.findOne({
    where: { userId: user2.id, channelId: gangChannel.id },
  });
  channelSub.destroy();

  Action.create({
    userId: user.id,
    action: "gangKick",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangKickMessage", user.name, user2.name, gang.name),
    gang,
  });

  res.json({ response: getText("gangLeaveSuccess") });
};

/**
 * a gang member [token] that's allowed (boss,underboss), kicks another gang member that's not himself [userId].
 *
 */
const gangRemove = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, userId } = req.body;

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

  const gang = await Gang.findOne({ where: { name: user.gang } });

  if (!gang || !user.gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_BOSS) {
    return res.json({ response: getText("noAccess") });
  }

  //all ok. deletegang
  deleteGang(gang, user, {
    Gang,
    User,
    Action,
    Channel,
    ChannelSub,
    ChannelMessage,
  });

  res.json({ response: getText("gangRemoveSuccess") });
};

const gangInvites = async (req, res, { User, GangRequest }) => {
  const { token, isInvite } = req.query;

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

  const invites = await GangRequest.findAll({
    where: { userId: user.id, isInvite: true },
  });
  let requests = [];

  if (user.gangLevel >= GANG_LEVEL_UNDERBOSS) {
    requests = await GangRequest.findAll({
      where: { gangName: user.gang, isInvite: false },
      include: { model: User, attributes: publicUserFields },
    });
  }

  res.json({ requests, invites });
};

const gangs = async (req, res, { User, Gang }) => {
  const gangs = await Gang.findAll({});
  res.json({ gangs });
};

const gang = async (req, res, { User, Gang }) => {
  const { name } = req.query;

  if (!name) {
    return res.json({ response: getText("noNameGiven") });
  }
  const gang = await Gang.findOne({ where: { name } });
  if (gang) {
    gang.members = await User.findAll({
      where: { gang: name },
      attributes: publicUserFields,
    });

    res.json({ gang, members });
  } else {
    return res.json({ response: getText("gangNotFound") });
  }
};

module.exports = {
  //post
  gangCreate,
  gangJoin,
  gangInvite,
  gangAnswerJoin,
  gangAnswerInvite,
  gangLeave,
  gangKick,
  gangRemove,
  gangTransaction,
  gangShop,
  gangUpdate,
  gangSetRank,
  gangOc,

  //get
  gangInvites,
  gangs,
  gang,
  gangAchievements,
};
