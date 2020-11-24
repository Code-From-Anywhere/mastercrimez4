const { Op, Sequelize } = require("sequelize");
const cars = require("../assets/cars.json");
const { getTextFunction, sendChatPushMail } = require("./util");

const TYPES = ["highway", "city", "forest"];

let getText = getTextFunction();

const createStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Action
) => {
  let { loginToken, numParticipants, type, price, carId } = req.body;
  numParticipants = Math.round(numParticipants);
  type = TYPES.includes(type) ? type : TYPES[0];

  if (!carId) {
    return res.json({ response: getText("streetraceNoCarId") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  if (price <= 0 || isNaN(price)) {
    res.json({ response: getText("invalidAmount") });
    return;
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

  const car = await Garage.findOne({ where: { id: carId, userId: user.id } });

  if (!car) {
    return res.json({ response: getText("streetraceNoCar") });
  }
  if (car.power < 1) {
    return res.json({ response: getText("streetraceNotEnoughPower") });
  }

  const carAsset = cars.find((c) => c.url === car.image);

  if (!carAsset) {
    return res.json({ response: getText("streetraceNoCarAsset") });
  }

  if (user.cash < Number(price)) {
    return res.json({ response: getText("notEnoughCash", price) });
  }

  const [updated] = await User.update(
    { cash: user.cash - price, onlineAt: Date.now() },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (updated !== 1) {
    return res.json({ response: getText("notEnoughCash", price) });
  }

  if (isNaN(numParticipants) || numParticipants < 2 || numParticipants > 24) {
    return res.json({ response: getText("streetraceInvalidParticipants") });
  }

  const typePower = carAsset[`power_${type}`];

  const race = await Streetrace.create({
    city: user.city,
    numParticipants,
    type,
    price,
    creator: user.name,
  });

  StreetraceParticipant.create({
    streetraceId: race.id,
    name: user.name,
    car: car.auto,
    image: car.image,
    power: car.power * typePower,
  });

  Action.create({
    userId: user.id,
    action: "createStreetrace",
    timestamp: Date.now(),
  });

  res.json({ response: getText("streetraceCreateSuccess"), success: true });
};

const joinStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Action
) => {
  let { loginToken, streetraceId, carId } = req.body;

  if (!carId) {
    return res.json({ response: getText("streetraceNoCarId") });
  }

  if (!streetraceId) {
    return res.json({ response: getText("streetraceNoStreetraceId") });
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

  const car = await Garage.findOne({ where: { id: carId, userId: user.id } });

  if (!car) {
    return res.json({ response: getText("streetraceNoCar") });
  }
  if (car.power < 1) {
    return res.json({ response: getText("streetraceNotEnoughPower") });
  }

  const carAsset = cars.find((c) => c.url === car.image);

  if (!carAsset) {
    return res.json({ response: getText("streetraceNoCarAsset") });
  }

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: getText("streetraceNoStreetrace") });
  }

  const alreadyParticipant = await StreetraceParticipant.findOne({
    where: { streetraceId, name: user.name },
  });
  if (alreadyParticipant) {
    return res.json({ response: getText("streetraceAlreadyParticipant") });
  }

  if (streetrace.city !== user.city) {
    return res.json({ response: getText("streetraceWrongCity") });
  }

  if (user.cash < Number(streetrace.price)) {
    return res.json({ response: getText("notEnoughCash", streetrace.price) });
  }

  const [updated] = await User.update(
    { cash: user.cash - streetrace.price, onlineAt: Date.now() },
    { where: { id: user.id, cash: { [Op.gte]: streetrace.price } } }
  );

  if (updated !== 1) {
    return res.json({ response: getText("notEnoughCash", streetrace.price) });
  }

  const typePower = carAsset[`power_${streetrace.type}`];

  StreetraceParticipant.create({
    streetraceId: streetrace.id,
    name: user.name,
    car: car.auto,
    image: car.image,
    power: car.power * typePower,
  });

  Action.create({
    userId: user.id,
    action: "joinstreetrace",
    timestamp: Date.now(),
  });

  res.json({ response: getText("streetraceJoinSuccess"), success: true });
};

const leaveStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Action
) => {
  let { loginToken, streetraceId } = req.body;

  if (!streetraceId) {
    return res.json({ response: getText("streetraceNoStreetraceId") });
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

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: getText("streetraceNoStreetrace") });
  }

  const participant = await StreetraceParticipant.findOne({
    where: { name: user.name, streetraceId: streetrace.id },
  });

  if (!participant) {
    return res.json({ response: getText("streetraceNoParticipant") });
  }

  const destroyed = await StreetraceParticipant.destroy({
    where: { id: participant.id },
  });

  if (destroyed === 0) {
    return res.json({ response: getText("streetraceNoParticipant") });
  }

  const [updated] = await User.update(
    {
      cash: Sequelize.literal(`cash + ${streetrace.price}`),
      onlineAt: Date.now(),
    },
    { where: { id: user.id } }
  );

  Action.create({
    userId: user.id,
    action: "leaveStreetrace",
    timestamp: Date.now(),
  });

  res.json({ response: getText("streetraceLeaveSuccess"), success: true });
};

const startStreetrace = async (
  req,
  res,
  {
    User,
    Streetrace,
    StreetraceParticipant,
    Channel,
    ChannelMessage,
    ChannelSub,
    Action,
  }
) => {
  let { loginToken, streetraceId } = req.body;

  if (!streetraceId) {
    return res.json({ response: getText("streetraceNoStreetraceId") });
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

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: getText("streetraceNoStreetrace") });
  }

  const participant = await StreetraceParticipant.findOne({
    where: { name: user.name, streetraceId: streetrace.id },
  });

  if (!participant) {
    return res.json({ response: getText("streetraceNoParticipant") });
  }

  const participants = await StreetraceParticipant.findAll({
    where: { streetraceId: streetrace.id },
  });

  if (participants.length < streetrace.numParticipants) {
    return res.json({ response: getText("streetraceNotFull") });
  }

  const participantsCum = participants.map((participant, index) => {
    const beforeParicipants = participants.filter((p, i) => i <= index);

    const returnThing = participant.dataValues;
    returnThing.cumPower = beforeParicipants.reduce(
      (previousValue, currentValue) => previousValue + currentValue.power,
      0
    );

    return returnThing;
  });

  const highestCum = participantsCum[participantsCum.length - 1].cumPower;
  const randomNumberBelowHighestCum = Math.random() * highestCum; //[0,highestCum]

  const winner = participantsCum.find(
    (p) => randomNumberBelowHighestCum <= p.cumPower
  );

  console.log("winner", winner);

  const participantsDestroyed = await StreetraceParticipant.destroy({
    where: { streetraceId: streetrace.id },
  });

  if (participantsDestroyed !== streetrace.numParticipants) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  const streetraceDestroyed = await Streetrace.destroy({
    where: { id: streetrace.id },
  });

  if (streetraceDestroyed === 0) {
    return res.json({ response: getText("streetraceStartAlready") });
  }
  const prizeMoney = streetrace.price * streetrace.numParticipants;

  User.update(
    { bank: Sequelize.literal(`bank + ${prizeMoney}`) },
    { where: { name: winner.name } }
  );

  participantsCum.forEach(async (p) => {
    const participantUser = await User.findOne({ where: { name: p.name } });
    if (participantUser) {
      const getParticipantText = getTextFunction(participantUser.locale);

      const report = `${getParticipantText("streetraceReportTitle")}

${participantsCum
  .map((p) => getParticipantText("streetraceReportParticipant", p.name, p.car))
  .join("\n")}
  
${getParticipantText("streetraceReportConclusion", winner.name, prizeMoney)}`;

      sendChatPushMail({
        Channel,
        ChannelMessage,
        ChannelSub,
        User,
        isSystem: true,
        message: report,
        user1: user,
        user2: participantUser,
      });
    }
  });

  //delete streetrace
  //delete participants
  //if delete streetrace is succesful, give winner pricemoney

  Action.create({
    userId: user.id,
    action: "startStreetrace",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("streetraceStartSuccess"),
    success: true,
  });
};

const streetraces = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant
) => {
  const streetraces = await Streetrace.findAll({
    include: { model: StreetraceParticipant, attributes: ["name"] },
  });
  res.json({ streetraces });
};

module.exports = {
  createStreetrace,
  joinStreetrace,
  leaveStreetrace,
  startStreetrace,
  streetraces,
};
