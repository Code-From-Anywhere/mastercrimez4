const { Op, Sequelize } = require("sequelize");
const {
  getTextFunction,
  sendChatPushMail,
  publicUserFields,
  saveImageIfValid,
  getRank,
  ranks,
  strengthRanks,
  getStrength,
} = require("./util");
const moment = require("moment");
let getText = getTextFunction();

const GANG_CREATE_COST = 5000000;
const GANG_LEVEL_UNDERBOSS = 3;
const GANG_LEVEL_BANK = 2;
const GANG_LEVEL_BOSS = 4;

const gangMissionsReleaseDate = moment("01/05/2021", "DD/MM/YYYY").set(
  "hour",
  17
);
const bulletFactoryReleaseDate = moment("15/08/2021", "DD/MM/YYYY").set(
  "hour",
  17
);

const deleteGang = async (
  gang,
  user,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  console.log("delete gang", gang.name);

  const allMembers = await User.findAll({ where: { gangId: user.gangId } });
  User.update(
    { gangId: null, gangLevel: 1 },
    { where: { gangId: user.gangId } }
  );
  //delete all channelsubs and channel
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  if (gangChannel) {
    await ChannelSub.destroy({ where: { channelId: gangChannel.id } });
    await gangChannel.destroy();
  }

  const destroyed = await gang.destroy();

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
  var realname = name.replace(/[^a-z0-9]/gi, "");

  if (realname.length < 3 || realname.length > 24) {
    return res.json({ response: getText("nameWrongLength", 3, 24) });
  }

  if (user.gangId) {
    return res.json({ response: getText("gangAlready") });
  }

  const already = await Gang.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", realname)
      ),
    },
  });

  if (already) {
    return res.json({ response: getText("gangAlreadyExists") });
  }

  if (user.cash < GANG_CREATE_COST) {
    return res.json({ response: getText("notEnoughCash", GANG_CREATE_COST) });
  }

  const gang = await Gang.create({ name: realname });

  const [updated] = await User.update(
    {
      gangId: gang.id,
      gangLevel: GANG_LEVEL_BOSS,
      cash: Sequelize.literal(`cash - ${GANG_CREATE_COST}`),
    },
    { where: { id: user.id } }
  );

  if (!updated) {
    return res.json({ response: getText("couldntUpdateUser") });
  }

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

  if (user.gangId) {
    return res.json({ response: getText("gangAlready") });
  }

  const alreadyRequested = await GangRequest.findOne({
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

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

  if (user2.gangId) {
    return res.json({ response: getText("personAlreadyInGang") });
  }

  const alreadyRequested = await GangRequest.findOne({
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

  console.log(req.body);

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
  }

  const joinRequest = await GangRequest.findOne({
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
  const destroyInvites = await GangRequest.destroy({
    where: { userId: user2.id },
  });

  Action.create({
    userId: user.id,
    action: "gangAnswerJoin",
    timestamp: Date.now(),
  });
  Gang.update(
    { members: Sequelize.literal(`members+1`) },
    { where: { name: gang.name } }
  );
  User.update({ gangId: gang.id, gangLevel: 0 }, { where: { id: user2.id } });
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

  res.json({ response: getText("gangAnswerJoinSuccess", user2.name) });
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

  const joinRequest = await GangRequest.findOne({
    where: { id, userId: user.id },
  });

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
  const destroyInvites = await GangRequest.destroy({
    where: { userId: user.id },
  });

  User.update({ gangId: gang.id, gangLevel: 0 }, { where: { id: user.id } });
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  //leave gang
  //if you're the only boss, highest other member gets your rank
  //if gang is empty now, delete it (use function for this)

  Gang.update(
    { members: Sequelize.literal(`members-1`) },
    { where: { name: gang.name } }
  );

  User.update({ gangId: null }, { where: { id: user.id } });
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  const channelSub = await ChannelSub.findOne({
    where: { userId: user.id, channelId: gangChannel.id },
  });
  channelSub.destroy();

  //remove all other gangrequests , including this one
  const destroyInvites = await GangRequest.destroy({
    where: { userId: user.id },
  });

  if (user.gangLevel === GANG_LEVEL_BOSS) {
    const otherBosses = await User.findAll({
      where: { gangId: user.gangId, gangLevel: GANG_LEVEL_BOSS },
    });
    if (otherBosses.length === 0) {
      //youre the only boss

      const otherMembers = await User.findAll({
        where: { gangId: user.gangId, name: { [Op.ne]: user.name } },
        order: [["gangLevel", "DESC"]],
      });

      if (otherMembers.length === 0) {
        //delete gang
        deleteGang(gang, user, {
          Gang,
          User,
          Action,
          Channel,
          ChannelSub,
          ChannelMessage,
        });
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
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
  }

  if (userId === user.id) {
    return res.json({ response: "invalidUser" });
  }

  const user2 = await User.findOne({
    where: { id: userId, gangId: gang.id },
  });

  if (!user2) {
    return res.json({ response: getText("gangKickUserNotFound") });
  }

  //all ok. kick

  Gang.update(
    { members: Sequelize.literal(`members-1`) },
    { where: { name: gang.name } }
  );

  User.update({ gangId: null, gangLevel: 1 }, { where: { id: user2.id } });
  const gangChannel = await Channel.findOne({ where: { gangName: gang.name } });
  const channelSub = await ChannelSub.findOne({
    where: { userId: user2.id, channelId: gangChannel.id },
  });
  channelSub.destroy();

  //remove all other gangrequests , including this one
  const destroyInvites = await GangRequest.destroy({
    where: { userId: user2.id },
  });

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

  res.json({ response: getText("gangKickSuccess", user2.name, gang.name) });
};

/**
 * a gang member [token] that's allowed (boss,underboss), updates the gang profile: image, profile, and name.
 *
 */
const gangUpdate = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangRequest }
) => {
  const { token, profile, image, name, message } = req.body;

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel < GANG_LEVEL_UNDERBOSS) {
    return res.json({ response: getText("noAccess") });
  }

  const update = {};

  if (name && name !== gang.name) {
    var realname = name.replace(/[^a-z0-9]/gi, "");

    if (realname.length < 3 || realname.length > 24) {
      return res.json({ response: getText("nameWrongLength", 3, 24) });
    }

    const already = await Gang.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", realname)
        ),
      },
    });

    if (already) {
      return res.json({ response: getText("gangAlreadyExists") });
    }

    //namechange
    update.name = realname;

    //also update channel and gangRequests
    Channel.update(
      { name: realname, gangName: realname },
      { where: { gangName: gang.name } }
    );
    GangRequest.update(
      { gangName: realname },
      { where: { gangName: gang.name } }
    );
  }

  if (profile && profile !== gang.profile) {
    //profile change
    update.profile = profile;
  }

  if (message && message !== gang.message) {
    //profile change
    update.message = message;
  }

  if (image && image.includes("data:image")) {
    //image change
    const { pathImage, pathThumbnail } = saveImageIfValid(res, image, true);

    console.log("image updaten");
    if (pathImage && pathThumbnail) {
      update.image = pathImage;
      update.thumbnail = pathThumbnail;
    }
  }

  const updateGang = Gang.update(update, { where: { id: gang.id } });

  Action.create({
    userId: user.id,
    action: "gangUpate",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangUpdateMessage", user.name, gang.name),
    gang,
  });

  res.json({ response: getText("gangUpdateSuccess") });
};

/**
 *
 */
const gangTransaction = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, amount, isToUser, isBullets } = req.body;
  //isToUser: true or false
  //isBullets: true or false

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

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: getText("invalidAmount") });
    return;
  }

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (
    user.gangLevel !== GANG_LEVEL_BOSS &&
    user.gangLevel !== GANG_LEVEL_BANK &&
    isToUser
  ) {
    return res.json({ response: getText("noAccess") });
  }

  const type = isBullets ? "bullets" : "bank";
  const typeString = isBullets ? getText("bullets") : getText("bankMoney");
  const directionString = isToUser
    ? getText("withdrawn")
    : getText("deposited");

  const theAmount = Math.round(amount);

  const amount2 = Math.round(amount * 0.95);

  if (isToUser) {
    if (gang[type] < amount) {
      return res.json({ response: getText("gangNotEnough") });
    }

    const [updated] = await Gang.update(
      { [type]: Sequelize.literal(`${type} - ${theAmount}`) },
      { where: { id: user.gangId, [type]: { [Op.gte]: theAmount } } }
    );

    if (updated === 1) {
      User.update(
        {
          [type]: Sequelize.literal(`${type} + ${amount2}`),
          numActions: Sequelize.literal(`numActions+1`),
          onlineAt: Date.now(),
        },
        { where: { id: user.id } }
      );
    }
  } else {
    if (user[type] < theAmount) {
      return res.json({ response: getText("notEnough") });
    }

    const [updated] = await User.update(
      {
        [type]: Sequelize.literal(`${type} - ${theAmount}`),
        numActions: Sequelize.literal(`numActions+1`),
        onlineAt: Date.now(),
      },
      { where: { id: user.id, [type]: { [Op.gte]: theAmount } } }
    );

    if (updated === 1) {
      Gang.update(
        { [type]: Sequelize.literal(`${type} + ${amount2}`) },
        { where: { id: user.gangId } }
      );
    }
  }

  Action.create({
    userId: user.id,
    action: "gangTransaction",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText(
      "gangTransactionMessage",
      user.name,
      directionString,
      theAmount,
      typeString
    ),
    gang,
  });

  res.json({
    response: getText(
      "gangTransactionSuccess",
      directionString,
      theAmount,
      typeString
    ),
  });
};

/**
 * the boss can do this.
 */
const gangSetRank = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, userId, rank } = req.body;

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (user.gangLevel !== GANG_LEVEL_BOSS) {
    return res.json({ response: getText("noAccess") });
  }

  if (!userId) {
    return res.json({ response: getText("noId") });
  }

  const user2 = await User.findOne({ where: { id: userId, gangId: gang.id } });
  if (!user2) {
    return res.json({ response: getText("personDoesntExist") });
  }

  const allBosses = await User.findAll({
    where: { gangId: user.gangId, gangLevel: GANG_LEVEL_BOSS },
  });

  if (userId === user.id && allBosses.length === 1) {
    //you're the only one
    return res.json({ response: getText("gangSetRankOnlyBoss") });
  }

  const theRank =
    rank < 1
      ? 1
      : rank > GANG_LEVEL_BOSS
      ? GANG_LEVEL_BOSS
      : isNaN(rank)
      ? 1
      : Math.round(rank);

  const getGangLevel = (gangLevel) =>
    getText(
      gangLevel === GANG_LEVEL_BOSS
        ? "gangLevelBoss"
        : gangLevel === GANG_LEVEL_UNDERBOSS
        ? "gangLevelUnderboss"
        : gangLevel === GANG_LEVEL_BANK
        ? "gangLevelBank"
        : "gangLevelMember"
    );

  const rankString = getGangLevel(theRank);

  User.update({ gangLevel: theRank }, { where: { id: user2.id } });
  Action.create({
    userId: user.id,
    action: "gangSetRank",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText("gangSetRankMessage", user.name, user2.name, rankString),
    gang,
  });

  res.json({
    response: getText("gangSetRankSuccess", user2.name, rankString),
  });
};

/**
 * accountant and boss can do this
 */
const gangShop = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, itemId, amount } = req.body;

  console.log(req.body);

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (
    user.gangLevel !== GANG_LEVEL_BOSS &&
    user.gangLevel !== GANG_LEVEL_BANK
  ) {
    return res.json({ response: getText("noAccess") });
  }

  if (!itemId || itemId < 1 || itemId > 12 || isNaN(itemId)) {
    return res.json({ response: getText("noId") });
  }

  if (!amount || isNaN(amount) || amount < 1) {
    return res.json({ response: getText("invalidAmount") });
  }

  const theItemId = Math.round(Number(itemId));
  const theAmount = Math.round(Number(amount));
  const current = gang[`item${theItemId}`];

  if (current === null || current === undefined) {
    return res.json({ response: getText("itemNotFound") });
  }

  if (current + theAmount > gang.power) {
    return res.json({ response: getText("notEnoughPower", gang.power) });
  }

  const prices = [
    null,
    50000,
    100000,
    200000,
    500000,
    1000000,
    1500000,
    2000000,
    3000000,
    4000000,
    5000000,
    10000000,
    20000000,
  ];

  const price = prices[theItemId] * theAmount;

  if (gang.bank < price) {
    return res.json({ response: getText("notEnoughMoney") });
  }

  const [updated] = await Gang.update(
    {
      bank: Sequelize.literal(`bank-${price}`),
      [`item${theItemId}`]: Sequelize.literal(`item${theItemId}+${theAmount}`),
      score: Sequelize.literal(`score + ${theItemId * theAmount}`),
    },
    {
      where: {
        id: gang.id,
        power: { [Op.gte]: current + theAmount },
        bank: { [Op.gte]: price },
      },
    }
  );

  if (updated !== 1) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  Action.create({
    userId: user.id,
    action: "gangShop",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("gangShopSuccess", theAmount),
  });
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
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

const gangInvites = async (req, res, { User, GangRequest, Gang }) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });
  const gang = await Gang.findOne({ where: { id: user.gangId } });

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
      where: { gangName: gang.name, isInvite: false },
      include: { model: User, attributes: publicUserFields },
    });
  }

  res.json({ requests, invites });
};

const gangs = async (req, res, { User, Gang }) => {
  const gangs = await Gang.findAll({
    attributes: { exclude: ["bullets"] },
    order: [["score", "DESC"]],
  });
  res.json({ gangs });
};

const police = async (req, res, { User, Gang }) => {
  const gangs = await Gang.findAll({
    where: { isPolice: true },
    include: { model: User, attributes: publicUserFields },
    order: [["score", "DESC"]],
  });
  res.json({ gangs });
};

const gang = async (req, res, { User, Gang }) => {
  const { name } = req.query;

  if (!name) {
    return res.json({ response: getText("noNameGiven") });
  }
  const gang = await Gang.findOne({
    where: { name },
    attributes: { exclude: ["bullets"] },
    include: { model: User, attributes: publicUserFields },
  });
  if (gang) {
    res.json(gang);
  } else {
    return res.json({ response: getText("gangNotFound") });
  }
};

/**
 * accountant and boss can do this
 */
const gangAchievements = async (
  req,
  res,
  { Gang, User, City, Action, Channel, ChannelSub, ChannelMessage }
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  const members = await User.findAll({ where: { gangId: gang.id } });

  if (members.length < 3) {
    //TODO:set to 3!
    if (gang.power > 0) {
      Gang.update({ power: 0 }, { where: { id: gang.id } });
    }
    return res.json({ response: getText("notEnoughMembers") });
  }
  const cities = await City.findAll({});
  const properties = [
    {
      name: "bulletFactory",
    },
    {
      name: "casino",
    },
    {
      name: "rld",
    },
    {
      name: "landlord",
    },
    {
      name: "junkies",
    },
    {
      name: "weaponShop",
    },
    {
      name: "airport",
    },
    {
      name: "estateAgent",
    },
    {
      name: "garage",
    },
    {
      name: "jail",
    },
    {
      name: "bank",
    },
  ];

  let propertiesAmount = 0;

  properties
    .map((p) => p.name)
    .forEach((property) => {
      return (
        cities &&
        cities.forEach((city, index) => {
          const ownerKey = `${property}Owner`;
          if (members.map((m) => m.name).includes(city[ownerKey])) {
            propertiesAmount += 1;
          }
        })
      );
    });

  const averagePropertiesAmount = Math.round(propertiesAmount / members.length);

  const averageRankNumber = Math.round(
    members
      .map((m) => getRank(m.rank, "number"))
      .reduce((previous, current) => previous + current, 0) / members.length
  );
  const averageRank2 = ranks[averageRankNumber - 1];
  const averageRank = averageRank2 && averageRank2.rank;

  const averageStrengthNumber = Math.round(
    members
      .map((m) => getStrength(m.strength, "number"))
      .reduce((previous, current) => previous + current, 0) / members.length
  );
  const averageStrength2 = strengthRanks[averageStrengthNumber - 1];
  const averageStrength = averageStrength2 && averageStrength2.rank;

  const averageGamepoints = Math.round(
    members
      .map((m) => m.gamepoints)
      .reduce((previous, current) => previous + current, 0) / members.length
  );

  const propertiesLevels = [0, 0.1, 0.2, 0.5, 0.75, 1, 2, 3, 4, 5]; //10
  const rankLevels = [1, 3, 5, 7, 9, 11, 13, 14, 15, 16]; //10
  const strengthLevels = [1, 4, 7, 10, 13, 16, 18, 20, 22, 23]; //10
  const gamepointsLevels = [
    0,
    100,
    500,
    1000,
    2000,
    4000,
    6000,
    8000,
    10000,
    25000,
  ]; //10
  const membersLevels = [3, 5, 7, 9, 12, 15, 18, 22, 26, 30]; //10

  const propertiesIndex = propertiesLevels.findIndex(
    (value) => value > averagePropertiesAmount
  );
  const propertiesLevel =
    propertiesIndex > 0 ? propertiesIndex : propertiesLevels.length;

  const rankLevel =
    rankLevels.findIndex((value) => value > averageRankNumber) ||
    rankLevels.length;

  const strengthLevel =
    strengthLevels.findIndex((value) => value > averageStrengthNumber) ||
    strengthLevels.length;

  const gamepointsLevel =
    gamepointsLevels.findIndex((value) => value > averageGamepoints) ||
    gamepointsLevels.length;

  const membersLevel =
    membersLevels.findIndex((value) => value > members.length) ||
    membersLevels.length;

  const nextRank = ranks[rankLevels[rankLevel]];
  const achievements = {
    properties: {
      current: averagePropertiesAmount,
      level: propertiesLevel,
      next: propertiesLevels[propertiesLevel],
    },
    rank: {
      current: averageRank,
      level: rankLevel,
      next: nextRank && nextRank.rank,
    },
    strength: {
      current: averageStrength,
      level: strengthLevel,
      next: strengthRanks[strengthLevels[strengthLevel]].rank,
    },
    gamepoints: {
      current: averageGamepoints,
      level: gamepointsLevel,
      next: gamepointsLevels[gamepointsLevel],
    },
    members: {
      current: members.length,
      level: membersLevel,
      next: membersLevels[membersLevel],
    },
  };

  const power =
    propertiesLevel +
    rankLevel +
    strengthLevel +
    gamepointsLevel +
    membersLevel;

  if (power !== gang.power) {
    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      gang,
      isSystem: true,
      message: getText("gangPowerMessage", power),
    });

    Gang.update({ power }, { where: { id: gang.id } });
  }

  res.json({
    achievements,
    power,
  });
};

/*Gang kogelfabriek

Als gang kan je een kogelfabriek opzetten.
Deze kogelfabriek levert kogels aan de gangbank. 
Om deze kogelfabriek te laten draaien moet een bepaalde target gehaald worden van arbeid.

Ochtend shift 6:00 tot 12:00
Middag shift 12:00 tot 18:00
Avond shift 18:00 tot 0:00
Nacht shift 0:00 tot 6:00

Er zijn n leden.
Elke speler kan 2 shifts doen per dag. Elke shift moet door n*1.8 leden gedaan worden. 
Oftewel, er moet goed gecoordineerd worden.

Normale kf brengt rond de 2miljoen kogels per dag in het spel bij 30 actieve leden.
De gangs moeten moet 1.5 miljoen kogels in het spel brengen, per dag, iets minder dus.
Een gang van 10 actieve, geverifieerde, leden krijgt dus 500k kogels per dag.
Als het lukt, krijgt de gang dus 50k kogels per speler per dag bij een grote kf.

Als alle shifts succesvol verlopen, komen er om 6:00 kogels op de gangbank erbij. 

Naast al dit werk, kost het bouwen van een kogelfabriek opstartkosten + een x kosten per dag.
De opstartkosten zijn 10 miljoen voor een kleine kf, 100 miljoen voor een middelmatige KF, en 1000 miljoen voor een grote KF, en 10miljard voor een mega kf. 
De runkosten zijn 1 miljoen voor een kleine kf, 10 miljoen voor een middelmatige kf, en 100 miljoen voor een grote kf, en 1 miljard voor een mega kf. 
Als de runkosten niet betaald kunnen worden door de gangbank, word de KF gesloopt. 

Hoe toon je die shifts mooi? Spelers per shift, niet shift per speler.

Dus qua code:
*/

const bulletFactories = [
  {
    type: "small",
    generates: 10000,
    initialCost: 10000000,
    dailyCost: 1000000,
  },
  {
    type: "medium",
    generates: 20000,
    initialCost: 100000000,
    dailyCost: 10000000,
  },
  {
    type: "big",
    generates: 40000,
    initialCost: 1000000000,
    dailyCost: 100000000,
  },
  {
    type: "mega",
    generates: 60000,
    initialCost: 10000000000,
    dailyCost: 1000000000,
  },
];

const getShifts = async (gang, User, Gang) => {
  const morning = await User.findAll({
    attributes: publicUserFields,
    where: { gangId: gang.id, morningShiftDone: true },
  });
  const day = await User.findAll({
    attributes: publicUserFields,
    where: { gangId: gang.id, dayShiftDone: true },
  });
  const evening = await User.findAll({
    attributes: publicUserFields,
    where: { gangId: gang.id, eveningShiftDone: true },
  });
  const night = await User.findAll({
    attributes: publicUserFields,
    where: { gangId: gang.id, nightShiftDone: true },
  });
  const underachievers = await User.findAll({
    attributes: publicUserFields,
    where: { gangId: gang.id, totalShiftsDone: { [Op.lt]: 2 } },
  });

  return { morning, day, evening, night, underachievers };
};

const shifts = async (req, res, { User, Gang }) => {
  const { token } = req.query;

  if (!token) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user || !user.gangId) {
    return res.json({ response: getText("invalidUser") });
  }

  const gang = await Gang.findOne({
    where: { id: user.gangId },
  });

  if (!gang) {
    return res.json({ response: getText("noAccess") });
  }

  const shifts = await getShifts(gang, User, Gang);
  res.json(shifts);
};

/*cron: 6AM every morning
for every gang that has a bulletfactory:
- pay running cost, remove bulletfactory if there isn't enough money
- produce bullets if enough work is done
- send rapport to gang about who did the shifts, if production was succesful, how many bullets were produced, and if the bulletfactory was removed.
*/
const SHIFT_FACTOR = 0.45;

const gangBulletFactoryCron = async ({
  Gang,
  User,
  Channel,
  ChannelMessage,
  ChannelSub,
}) => {
  const bulletFactoryGangs = await Gang.findAll({
    where: { bulletFactory: { [Op.ne]: "none" } },
  });
  bulletFactoryGangs.map(async (gang) => {
    const bulletFactory = bulletFactories.find(
      (x) => x.type === gang.bulletFactory
    );
    const cost = bulletFactory.dailyCost;
    const [paymentSuccesful] = await Gang.update(
      { bank: Sequelize.literal(`bank-${cost}`) },
      { where: { id: gang.id, bank: { [Op.gte]: cost } } }
    );
    if (paymentSuccesful) {
      const shifts = await getShifts(gang, User, Gang);

      if (
        shifts.morning.length > Math.floor(gang.members * SHIFT_FACTOR) &&
        shifts.day.length > Math.floor(gang.members * SHIFT_FACTOR) &&
        shifts.evening.length > Math.floor(gang.members * SHIFT_FACTOR) &&
        shifts.night.length > Math.floor(gang.members * SHIFT_FACTOR)
      ) {
        //enough
        const generated = bulletFactory.generates * gang.members;
        Gang.update(
          {
            bullets: Sequelize.literal(`bullets + ${generated}`),
          },
          { where: { id: gang.id } }
        );

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          gang,
          isShareable: true,
          message: getText("gangBulletFactoryCronSuccess", generated),
        });
      } else {
        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          gang,
          isShareable: true,
          message: getText("gangBulletFactoryCronFailed"),
        });
      }
    } else {
      sendChatPushMail({
        Channel,
        ChannelMessage,
        ChannelSub,
        User,
        gang,
        isShareable: true,
        message: getText("gangBulletFactoryCronPaymentFailed"),
      });
      Gang.update({ bullfetFactory: "none" }, { where: { id: gang.id } });
    }

    User.update(
      {
        morningShiftDone: false,
        dayShiftDone: false,
        eveningShiftDone: false,
        nightShiftDone: false,
        totalShiftsDone: 0,
      },
      { where: { gangId: gang.id } }
    );
  });
};

/**
 * accountant and boss can do this
 */
const gangBuyBulletFactory = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, type } = req.body;

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (!gang.isPolice && moment().isBefore(bulletFactoryReleaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (
    user.gangLevel !== GANG_LEVEL_BOSS &&
    user.gangLevel !== GANG_LEVEL_BANK
  ) {
    return res.json({ response: getText("noAccess") });
  }
  const bulletFactory = bulletFactories.find((x) => x.type === type);

  if (!bulletFactory) {
    return res.json({ response: getText("invalidValues") });
  }

  if (gang.bank < bulletFactory.initialCost) {
    return res.json({ response: getText("notEnoughMoney") });
  }

  const [updated] = await Gang.update(
    {
      bank: Sequelize.literal(`bank-${bulletFactory.initialCost}`),
      bulletFactory: bulletFactory.type,
    },
    {
      where: {
        id: gang.id,
        bank: { [Op.gte]: bulletFactory.initialCost },
      },
    }
  );

  if (updated !== 1) {
    return res.json({ response: getText("notEnoughMoney") });
  }

  Action.create({
    userId: user.id,
    action: "buyBulletFactory",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("gangBuyBulletFactorySuccess"),
  });
};

const userDoShift = async (
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (gang.bulletFactory === "none") {
    return res.json({ response: getText("shiftNoBulletFactory") });
  }

  //user must be verified
  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });

  if (isNotVerified) {
    return res.json({ response: getText("accountNotVerified") });
  }

  const local = moment().local();
  const whichShift =
    local.hour() >= 0 && local.hour() < 6
      ? "night"
      : local.hour() >= 6 && local.hour() < 12
      ? "morning"
      : local.hour() >= 12 && local.hour() < 18
      ? "day"
      : "evening";

  if (user[`${whichShift}ShiftDone`]) {
    return res.json({ response: getText("shiftAlreadyDone") });
  }

  if (user.totalShiftsDone >= 2) {
    return res.json({ response: getText("tooManyShifts") });
  }

  User.update(
    {
      [`${whichShift}ShiftDone`]: true,
      totalShiftsDone: Sequelize.literal("totalShiftsDone+1"),
    },
    { where: { id: user.id } }
  );

  Action.create({
    userId: user.id,
    action: "doShift",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("doShiftSuccess"),
  });
};

//what: crime, stealCar, work, kills, ocs
const gangMissionsArray = [
  {
    what: "stealCar",
    amountPerMember: 3,
    seconds: 300,
    award: 100000,
    awardWhat: "bank",
  },

  {
    what: "crime",
    amountPerMember: 3,
    seconds: 300,
    award: 100000,
    awardWhat: "bank",
  },

  {
    what: "work",
    amountPerMember: 1,
    seconds: 300,
    award: 100000,
    awardWhat: "bank",
  },

  {
    what: "kill",
    amountPerMember: 1,
    seconds: 3600,
    award: 100000,
    awardWhat: "bullets",
  },

  {
    what: "stealLegendaricCar",
    amountPerMember: 10,
    seconds: 3600,
    award: 100000,
    awardWhat: "bullets",
  },

  {
    what: "stealCar",
    amountPerMember: Math.round(0.75 * 50),
    seconds: 3600,
    award: 100000,
    awardWhat: "bullets",
  },
];

const getGangMissions = async ({ User, Gang, GangMission, gang }) => {
  const missions = await GangMission.findAll({ where: { gangId: gang.id } });

  return gangMissionsArray.map((missionObject, index) => {
    const mission = missions.find((x) => x.missionIndex === index);

    missionObject.current = mission;
    return missionObject;
  });
};

const gangMissions = async (req, res, { User, Gang, GangMission }) => {
  const { token } = req.query;

  if (!token) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user || !user.gangId) {
    return res.json({ response: getText("invalidUser") });
  }

  const gang = await Gang.findOne({
    where: { id: user.gangId },
  });

  if (!gang) {
    return res.json({ response: getText("noAccess") });
  }

  const missions = await getGangMissions({ User, Gang, GangMission, gang });

  return res.json(missions);
};

const gangMissionPrestige = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangMission }
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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (
    user.gangLevel !== GANG_LEVEL_BOSS &&
    user.gangLevel !== GANG_LEVEL_UNDERBOSS
  ) {
    return res.json({ response: getText("noAccess") });
  }

  const allSucceededMissions = await GangMission.findAll({
    where: { isSucceeded: true },
  });
  if (allSucceededMissions.length >= gangMissionsArray.length) {
    //up prestige
    //remove all completed missions
    const destroyed = await GangMission.destory({
      where: { isSucceeded: true },
    });

    if (destroyed >= gangMissionsArray.length) {
      Gang.update(
        { prestige: Sequelize.literal(`prestige+1`) },
        { where: { id: gang.id } }
      );
    }

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      gang,
      isShareable: true,
      isSystem: true,
      message: getText("gangMissionPrestigeSuccess"),
    });

    return res.json({ response: getText("success") });
  } else {
    return res.json({ response: getText("fail") });
  }
};

/**
 * gangStartMission
 */
const gangStartMission = async (
  req,
  res,
  { Gang, User, Action, Channel, ChannelSub, ChannelMessage, GangMission }
) => {
  const { token, index } = req.body;

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

  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (moment().isBefore(gangMissionsReleaseDate) && user.level < 2) {
    return res.json({ response: getText("noAccess") });
  }

  if (!gang || !user.gangId) {
    return res.json({ response: getText("gangDoesntExist") });
  }

  if (
    user.gangLevel !== GANG_LEVEL_BOSS &&
    user.gangLevel !== GANG_LEVEL_UNDERBOSS
  ) {
    return res.json({ response: getText("noAccess") });
  }

  const invalidIndex = !gangMissionsArray[Math.round(Number(index))];

  if (invalidIndex) {
    return res.json({ response: getText("invalidValues") });
  }
  const already = await GangMission.findOne({
    where: { missionIndex: index, gangId: gang.id },
  });

  const alreadyAnother = await GangMission.findOne({
    where: { gangId: gang.id, isEnded: false },
  });

  if (alreadyAnother) {
    return res.json({ response: getText("gangMissionAlreadyAnother") });
  }
  if (already && already.isSucceeded) {
    return res.json({ response: getText("gangMissionAlreadySucceeded") });
  }
  if (already && !already.isEnded) {
    return res.json({ response: getText("gangMissionAlreadyInProgress") });
  }

  if (already && already.isEnded && !already.isSucceeded) {
    //mission has to be deleted, because it didn't succeed
    GangMission.destroy({
      where: {
        missionIndex: index,
        gangId: gang.id,
        isSucceeded: false,
        isEnded: true,
      },
    });
  }

  GangMission.create({ gangId: gang.id, missionIndex: index, amountDone: 0 });

  Action.create({
    userId: user.id,
    action: "gangStartMission",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("gangStartMissionSuccess"),
  });
};

const gangFinishMissionCron = async ({
  Gang,
  User,
  Channel,
  ChannelMessage,
  ChannelSub,
  GangMission,
}) => {
  const allCurrentMissions = await GangMission.findAll({
    where: { isEnded: false },
  });
  console.log("allCurrentmissions", allCurrentMissions.length);

  allCurrentMissions.forEach(async (mission) => {
    const missionObject = gangMissionsArray[mission.missionIndex];
    const gang = await Gang.findOne({ where: { id: mission.gangId } });
    if (!gang) {
      GangMission.destroy({ where: { id: mission.id } });
      return;
    }

    const user = await User.findOne({ where: { gangId: gang.id } });
    const getText = getTextFunction(user.locale);

    if (
      moment(mission.createdAt).isBefore(
        moment().subtract(missionObject.seconds, "seconds")
      )
    ) {
      //mission has passed
      if (mission.amountDone > missionObject.amountPerMember * gang.members) {
        GangMission.update(
          { isEnded: true, isSucceeded: true },
          { where: { id: mission.id } }
        );

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          gang,
          isShareable: true,
          isSystem: true,
          message: getText(
            "gangFinishMissionCronSuccess",
            missionObject.award,
            missionObject.awardWhat
          ),
        });

        Gang.update(
          {
            [missionObject.awardWhat]: Sequelize.literal(
              `${missionObject.awardWhat}+${missionObject.award}`
            ),
          },
          { where: { id: mission.gangId } }
        );
      } else {
        GangMission.update(
          { isEnded: true, isSucceeded: false },
          { where: { id: mission.id } }
        );

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          gang,
          isShareable: false,
          isSystem: true,
          message: getText("gangFinishMissionCronFailed"),
        });
      }
    }
  });
};

const doGangMission = async ({ Gang, GangMission, user, amount, what }) => {
  if (!user.gangId) {
    return;
  }
  const gang = await Gang.findOne({ where: { id: user.gangId } });

  if (!gang) {
    return;
  }

  const currentMission = await GangMission.findOne({
    where: {
      gangId: gang.id,
      isEnded: false,
    },
  });

  if (!currentMission) {
    return;
  }

  const missionObject = gangMissionsArray[currentMission.missionIndex];
  if (!missionObject) {
    return;
  }

  if (missionObject.what === what) {
    GangMission.update(
      { amountDone: Sequelize.literal(`amountDone+${amount}`) },
      { where: { id: currentMission.id } }
    );
  }
};

module.exports = {
  //missions
  //functions
  doGangMission,
  //get
  gangMissions,
  //post
  gangStartMission,
  gangMissionPrestige,

  //cron
  gangFinishMissionCron,

  //bulletfactory
  //cron
  gangBulletFactoryCron,
  //post
  userDoShift,
  gangBuyBulletFactory,
  //get
  shifts,

  //post
  gangCreate,
  gangAnswerInvite, //gangs
  gangJoin, //gang

  gangInvite, //gangSettings
  gangAnswerJoin, //gangSettings
  gangLeave, //gangSettings
  gangKick, //gangSettings
  gangRemove, //gangSettings
  gangUpdate, //gangSettings
  gangTransaction, //gangSettings
  gangSetRank, //gangSettings
  gangShop,

  //get
  gangInvites, //gangs,gangSettings
  gangs,
  police,
  gang, //gang, gangSettings
  gangAchievements,
};
