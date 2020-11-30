const { Op, Sequelize } = require("sequelize");
const cars = require("../assets/cars.json");
const {
  getTextFunction,
  sendChatPushMail,
  getStrength,
  publicUserFields,
} = require("./util");

const moment = require("moment");
const TYPES = [
  {
    type: "snackbar",
    cost: 10000,
    profit: 50000,
    difficulty: 1,
    seconds: 60,
  },
  {
    type: "clothesstore",
    cost: 20000,
    profit: 75000,
    difficulty: 5,
    seconds: 180,
  },
  {
    type: "supermarket",
    cost: 50000,
    profit: 100000,
    difficulty: 10,
    seconds: 240,
  },
  {
    type: "drugstore",
    cost: 100000,
    profit: 250000,
    difficulty: 20,
    seconds: 300,
  },
  {
    type: "coffeeshop",
    cost: 150000,
    profit: 300000,
    difficulty: 50,
    seconds: 300,
  },
  {
    type: "cardealer",
    cost: 200000,
    profit: 400000,
    difficulty: 100,
    seconds: 600,
  },
  {
    type: "bank",
    cost: 250000,
    profit: 500000,
    difficulty: 200,
    seconds: 900,
  },
  {
    type: "casino",
    cost: 500000,
    profit: 1000000,
    difficulty: 300,
    seconds: 1800,
  },
  {
    type: "jewelrystore",
    cost: 1000000,
    profit: 2000000,
    difficulty: 500,
    seconds: 3600,
  },
];

let getText = getTextFunction();

const releaseDate = moment("15/06/2021", "DD/MM/YYYY").set("hour", 17);

const createRobbery = async (
  req,
  res,
  User,
  Robbery,
  RobberyParticipant,
  Garage,
  Action
) => {
  let { loginToken, numParticipants, type } = req.body;
  numParticipants = Math.round(numParticipants);
  type = TYPES.find((x) => x.type === type) || TYPES[0];

  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  if (user.level < 2 && moment().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  const alreadyParticipant = await RobberyParticipant.findOne({
    where: { userId: user.id },
  });
  if (alreadyParticipant) {
    return res.json({ response: getText("alreadyParticipantOther") });
  }

  getText = getTextFunction(user.locale);

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.robberyAt + user.robberySeconds * 1000 > Date.now()) {
    return res.json({ response: getText("robberyWait") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  const cost = type.cost;

  if (user.cash < cost) {
    return res.json({ response: getText("notEnoughCash", cost) });
  }

  const [updated] = await User.update(
    { cash: user.cash - cost, onlineAt: Date.now() },
    { where: { id: user.id, cash: { [Op.gte]: cost } } }
  );

  if (updated !== 1) {
    return res.json({ response: getText("notEnoughCash", cost) });
  }

  if (isNaN(numParticipants) || numParticipants < 2 || numParticipants > 24) {
    return res.json({ response: getText("robberyInvalidParticipants") });
  }

  const rob = await Robbery.create({
    city: user.city,
    numParticipants,
    type: type.type,
    creator: user.name,
  });

  RobberyParticipant.create({
    robberyId: rob.id,
    userId: user.id,
  });

  Action.create({
    userId: user.id,
    action: "createRobbery",
    timestamp: Date.now(),
  });

  res.json({ response: getText("robberyCreateSuccess"), success: true });
};

const joinRobbery = async (
  req,
  res,
  User,
  Robbery,
  RobberyParticipant,
  Garage,
  Action
) => {
  let { loginToken, robberyId } = req.body;

  if (!robberyId) {
    return res.json({ response: getText("robberyNoRobberyId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (user.robberyAt + user.robberySeconds * 1000 > Date.now()) {
    return res.json({ response: getText("robberyWait") });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  const robbery = await Robbery.findOne({ where: { id: robberyId } });

  if (!robbery) {
    return res.json({ response: getText("robberyNoRobbery") });
  }

  const alreadyParticipant = await RobberyParticipant.findOne({
    where: { robberyId, userId: user.id },
  });
  if (alreadyParticipant) {
    return res.json({ response: getText("robberyAlreadyParticipant") });
  }

  const alreadyParticipantOther = await RobberyParticipant.findOne({
    where: { userId: user.id },
  });
  if (alreadyParticipantOther) {
    return res.json({ response: getText("alreadyParticipantOther") });
  }

  if (robbery.city !== user.city) {
    return res.json({ response: getText("robberyWrongCity") });
  }

  const type = TYPES.find((x) => x.type === robbery.type);

  if (!type) {
    return res.json({ response: getText("somethingWentWrong") });
  }
  if (user.cash < type.cost) {
    return res.json({ response: getText("notEnoughCash", type.cost) });
  }

  const [updated] = await User.update(
    { cash: user.cash - type.cost, onlineAt: Date.now() },
    { where: { id: user.id, cash: { [Op.gte]: type.cost } } }
  );

  if (updated !== 1) {
    return res.json({ response: getText("notEnoughCash", type.cost) });
  }

  RobberyParticipant.create({
    robberyId: robbery.id,
    userId: user.id,
  });

  Action.create({
    userId: user.id,
    action: "joinrobbery",
    timestamp: Date.now(),
  });

  res.json({ response: getText("robberyJoinSuccess"), success: true });
};

const leaveRobbery = async (
  req,
  res,
  User,
  Robbery,
  RobberyParticipant,
  Garage,
  Action
) => {
  let { loginToken, robberyId } = req.body;

  if (!robberyId) {
    return res.json({ response: getText("robberyNoRobberyId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  getText = getTextFunction(user.locale);

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  const robbery = await Robbery.findOne({ where: { id: robberyId } });

  if (!robbery) {
    return res.json({ response: getText("robberyNoRobbery") });
  }

  const participant = await RobberyParticipant.findOne({
    where: { userId: user.id, robberyId: robbery.id },
  });

  if (!participant) {
    return res.json({ response: getText("robberyNoParticipant") });
  }

  const destroyed = await RobberyParticipant.destroy({
    where: { id: participant.id },
  });

  if (destroyed === 0) {
    return res.json({ response: getText("robberyNoParticipant") });
  }

  const type = TYPES.find((x) => x.type === robbery.type);

  const [updated] = await User.update(
    {
      cash: Sequelize.literal(`cash + ${type.cost}`),
      onlineAt: Date.now(),
    },
    { where: { id: user.id } }
  );

  const nowParticipants = await RobberyParticipant.findAll({
    where: { robberyId: robbery.id },
  });

  if (nowParticipants.length === 0) {
    //also delete robbery
    Robbery.destroy({ where: { id: robbery.id } });
  }
  Action.create({
    userId: user.id,
    action: "leaveRobbery",
    timestamp: Date.now(),
  });

  res.json({ response: getText("robberyLeaveSuccess"), success: true });
};

const startRobbery = async (
  req,
  res,
  {
    User,
    Robbery,
    RobberyParticipant,
    Channel,
    ChannelMessage,
    ChannelSub,
    Action,
  }
) => {
  let { loginToken, robberyId } = req.body;

  if (!robberyId) {
    return res.json({ response: getText("robberyNoRobberyId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }
  getText = getTextFunction(user.locale);

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  const robbery = await Robbery.findOne({ where: { id: robberyId } });

  if (!robbery) {
    return res.json({ response: getText("robberyNoRobbery") });
  }

  const participant = await RobberyParticipant.findOne({
    where: { userId: user.id, robberyId: robbery.id },
  });

  if (!participant) {
    return res.json({ response: getText("robberyNoParticipant") });
  }

  const participants = await RobberyParticipant.findAll({
    where: { robberyId: robbery.id },
    include: { model: User },
  });

  if (participants.length < robbery.numParticipants) {
    return res.json({ response: getText("robberyNotFull") });
  }

  //calculate what the profit can be

  const type = TYPES.find((x) => x.type === robbery.type);

  if (!type) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  const participantsDestroyed = await RobberyParticipant.destroy({
    where: { robberyId: robbery.id },
  });

  if (participantsDestroyed !== robbery.numParticipants) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  const robberyDestroyed = await Robbery.destroy({
    where: { id: robbery.id },
  });

  if (robberyDestroyed === 0) {
    return res.json({ response: getText("robberyStartAlready") });
  }

  const maxChance = 0.75;
  const random = Math.random();
  const cumStrength = participants.reduce(
    (previous, p) => previous + getStrength(p.user.strength, "number"),
    0
  );

  let chance = cumStrength / type.difficulty;
  chance = chance > maxChance ? maxChance : chance;

  const isSuccess = random < chance;

  const profit = type.profit * robbery.numParticipants;
  participants.forEach(async (participant) => {
    const pUser = participant.user;
    if (pUser) {
      const getParticipantText = getTextFunction(pUser.locale);

      const report = getParticipantText(
        isSuccess ? "robberySuccess" : "robberyFail",
        getParticipantText(type.type),
        profit
      );

      User.update(
        {
          robberyAt: Date.now(),
          robberySeconds: type.seconds,
        },
        { where: { id: pUser.id } }
      );

      if (isSuccess) {
        const strength = Math.ceil(type.difficulty * 0.1);
        const rank = Math.ceil(type.difficulty * 0.1);
        const gamepoints = Math.ceil(type.difficulty * 0.01);
        User.update(
          {
            cash: Sequelize.literal(`cash + ${type.profit}`),
            strength: Sequelize.literal(`strength + ${strength}`),
            rank: Sequelize.literal(`rank + ${rank}`),
            gamepoints: Sequelize.literal(`gamepoints + ${gamepoints}`),
          },
          { where: { id: pUser.id } }
        );
      } else {
        const seconden = 300;
        User.update(
          { jailAt: Date.now() + seconden * 1000 },
          { where: { id: pUser.id } }
        );
      }

      sendChatPushMail({
        Channel,
        ChannelMessage,
        ChannelSub,
        User,
        isSystem: true,
        isShareable: true,
        message: report,
        user1: user,
        user2: pUser,
      });
    }
  });

  //delete robbery
  //delete participants
  //if delete robbery is succesful, give winner pricemoney

  Action.create({
    userId: user.id,
    action: "startRobbery",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("robberyStartSuccess"),
    success: true,
  });
};

const robberies = async (req, res, User, Robbery, RobberyParticipant) => {
  const robberies2 = await Robbery.findAll({
    order: [["id", "DESC"]],
    include: {
      model: RobberyParticipant,
      include: { model: User, attributes: publicUserFields },
    },
  });
  res.json({ robberies: robberies2 });
};

module.exports = {
  createRobbery,
  joinRobbery,
  leaveRobbery,
  startRobbery,
  robberies,
};
