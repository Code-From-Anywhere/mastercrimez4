const { Op, Sequelize } = require("sequelize");
const cars = require("../assets/cars.json");
const {
  getTextFunction,
  sendChatPushMail,
  getRank,
  getStrength,
} = require("./util");
const TYPES = ["bank", "cars", "shootout"]; //cash, bullets, rank+strength
const moment = require("moment");
let getText = getTextFunction();

const releaseDate = moment("15/01/2021", "DD/MM/YYYY").set("hour", 17);

const createOc = async (
  req,
  res,
  User,
  Oc,
  OcParticipant,
  Garage,
  Action,
  Gang
) => {
  let { loginToken, numParticipants, type, carId } = req.body;
  numParticipants = Math.round(numParticipants);
  type = TYPES.includes(type) ? type : TYPES[0];

  if (!carId) {
    return res.json({ response: getText("ocNoCarId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }
  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().local().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  const gang = await Gang.findOne({ where: { id: user.gangId } });
  if (!gang) {
    return res.json({ response: getText("noGang") });
  }

  const already = Oc.findAll({ where: { gangId: gang.id } });
  if (already.length > 3) {
    return res.json({ response: getText("ocTooManyOcs") });
  }

  if (gang.ocAt + 3600000 > Date.now()) {
    const seconds = Math.round((gang.ocAt + 3600000 - Date.now()) / 1000);
    return res.json({ response: getText("ocWait", seconds) });
  }

  if (user.ocAt + 3600000 > Date.now()) {
    const seconds = Math.round((user.ocAt + 3600000 - Date.now()) / 1000);
    return res.json({ response: getText("ocWait", seconds) });
  }

  if (!user.gangId) {
    return res.json({ response: getText("ocNoGang") });
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

  const car = await Garage.findOne({ where: { id: carId, userId: user.id } });

  if (!car) {
    return res.json({ response: getText("ocNoCar") });
  }

  if (car.power < 1) {
    return res.json({ response: getText("ocNotEnoughPower") });
  }

  const carAsset = cars.find((c) => c.url === car.image);

  if (!carAsset) {
    return res.json({ response: getText("ocNoCarAsset") });
  }

  if (isNaN(numParticipants) || numParticipants < 2 || numParticipants > 24) {
    return res.json({ response: getText("ocInvalidParticipants") });
  }

  const typePower =
    carAsset.power_city + carAsset.power_forest + carAsset.power_highway;

  const oc = await Oc.create({
    city: user.city,
    numParticipants,
    gangId: user.gangId,
    type,
    creator: user.name,
  });

  OcParticipant.create({
    ocId: oc.id,
    name: user.name,
    car: car.auto,
    image: car.image,
    power: car.power * typePower,
  });

  Action.create({
    userId: user.id,
    action: "createOc",
    timestamp: Date.now(),
  });

  res.json({ response: getText("ocCreateSuccess"), success: true });
};

const joinOc = async (req, res, User, Oc, OcParticipant, Garage, Action) => {
  let { loginToken, ocId } = req.body;

  if (!ocId) {
    return res.json({ response: getText("ocNoOcId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().local().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (user.ocAt + 3600000 > Date.now()) {
    const seconds = Math.round((user.ocAt + 3600000 - Date.now()) / 1000);

    return res.json({ response: getText("ocWait", seconds) });
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

  const oc = await Oc.findOne({ where: { id: ocId, gangId: user.gangId } });

  if (!oc) {
    return res.json({ response: getText("ocNoOc") });
  }

  const alreadyParticipant = await OcParticipant.findOne({
    where: { ocId, name: user.name },
  });
  if (alreadyParticipant) {
    return res.json({ response: getText("ocAlreadyParticipant") });
  }

  if (oc.city !== user.city) {
    return res.json({ response: getText("ocWrongCity") });
  }

  OcParticipant.create({
    ocId: oc.id,
    name: user.name,
    power:
      (user.weapon + user.protection) *
      (getRank(user.rank, "number") + getStrength(user.strength, "number")),
  });

  Action.create({
    userId: user.id,
    action: "joinoc",
    timestamp: Date.now(),
  });

  res.json({ response: getText("ocJoinSuccess"), success: true });
};

const leaveOc = async (req, res, User, Oc, OcParticipant, Gang, Action) => {
  let { loginToken, ocId } = req.body;

  if (!ocId) {
    return res.json({ response: getText("ocNoOcId") });
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

  const oc = await Oc.findOne({ where: { id: ocId } });

  if (!oc) {
    return res.json({ response: getText("ocNoOc") });
  }

  const participant = await OcParticipant.findOne({
    where: { name: user.name, ocId: oc.id },
  });

  if (!participant) {
    return res.json({ response: getText("ocNoParticipant") });
  }

  const destroyed = await OcParticipant.destroy({
    where: { id: participant.id },
  });

  if (destroyed === 0) {
    return res.json({ response: getText("ocNoParticipant") });
  }

  Action.create({
    userId: user.id,
    action: "leaveOc",
    timestamp: Date.now(),
  });

  res.json({ response: getText("ocLeaveSuccess"), success: true });
};

const startOc = async (
  req,
  res,
  { User, Oc, OcParticipant, Channel, ChannelMessage, ChannelSub, Action, Gang }
) => {
  let { loginToken, ocId } = req.body;

  if (!ocId) {
    return res.json({ response: getText("ocNoOcId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }
  getText = getTextFunction(user.locale);
  const gang = Gang.findOne({ where: { id: user.gangId } });

  if (!gang) {
    return res.json({ response: getText("noGang") });
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

  const oc = await Oc.findOne({ where: { id: ocId } });

  if (!oc) {
    return res.json({ response: getText("ocNoOc") });
  }

  const participant = await OcParticipant.findOne({
    where: { name: user.name, ocId: oc.id },
  });

  if (!participant) {
    return res.json({ response: getText("ocNoParticipant") });
  }

  const participants = await OcParticipant.findAll({
    where: { ocId: oc.id },
  });

  if (participants.length < oc.numParticipants) {
    return res.json({ response: getText("ocNotFull") });
  }

  const participantsDestroyed = await OcParticipant.destroy({
    where: { ocId: oc.id },
  });

  if (participantsDestroyed !== oc.numParticipants) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  const ocDestroyed = await Oc.destroy({
    where: { id: oc.id },
  });

  if (ocDestroyed === 0) {
    return res.json({ response: getText("ocStartAlready") });
  }

  //delete oc
  //delete participants
  //if delete oc is succesful,

  const totalPower = participants.reduce(
    (previous, participant) => previous + participant.power,
    0
  );
  //360 per participant
  const what =
    oc.type === "bank" ? "bank" : oc.type === "cars" ? "bullets" : "rank";
  const amount =
    oc.type === "bank"
      ? Math.round(Math.random() * totalPower * 1000)
      : oc.type === "cars"
      ? Math.round(Math.random() * totalPower * 10)
      : Math.round((Math.random() * totalPower * 0.01) / participants.length);
  const whatString = getText(what);
  const typeString = getText(oc.type + "OcType");
  if (what === "rank") {
    participants.forEach((participant) => {
      User.update(
        {
          rank: Sequelize.literal(`rank+${amount}`),
          strength: Sequelize.literal(`strength+${amount}`),
        },
        { where: { name: participant.name } }
      );
    });
  } else {
    Gang.update(
      { [what]: Sequelize.literal(`${what}+${amount}`) },
      { where: { id: oc.gangId } }
    );
  }

  participants.forEach((participant) => {
    User.update(
      {
        ocAt: Date.now(),
      },
      { where: { name: participant.name } }
    );
  });

  Gang.update({ ocAt: Date.now() }, { where: { id: oc.gangId } });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    gang,
    user1: user,
    isShareable: true,
    isSystem: true,
    message: getText("ocStartSuccess", typeString, amount, whatString),
  });

  Action.create({
    userId: user.id,
    action: "startOc",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("ocStartSuccess", typeString, amount, whatString),
    success: true,
  });
};

const ocs = async (req, res, User, Oc, OcParticipant) => {
  const { token } = req.query;
  if (!token) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  if (!user.gangId) {
    return res.json({ response: getText("noGang") });
  }

  const ocs2 = await Oc.findAll({
    where: { gangId: user.gangId },
    include: { model: OcParticipant, attributes: ["name"] },
  });

  res.json({ ocs: ocs2 });
};

module.exports = {
  createOc,
  joinOc,
  leaveOc,
  startOc,
  ocs,
};
