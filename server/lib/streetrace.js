const { Op, Sequelize } = require("sequelize");
const cars = require("../assets/cars.json");
const { sendMessageAndPush } = require("./util");

const TYPES = ["highway", "city", "forest"];

const createStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Message
) => {
  let { loginToken, numParticipants, type, price, carId } = req.body;
  numParticipants = Math.round(numParticipants);
  type = TYPES.includes(type) ? type : TYPES[0];

  if (!carId) {
    return res.json({ response: "Geef een auto op" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }

  if (price <= 0 || isNaN(price)) {
    res.json({ response: "Ongeldige hoeveelheid" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  const car = await Garage.findOne({ where: { id: carId, userId: user.id } });

  if (!car) {
    return res.json({ response: "Kon auto niet vinden" });
  }
  if (car.power < 1) {
    return res.json({ response: "Je auto heeft niet genoeg power" });
  }

  const carAsset = cars.find((c) => c.url === car.image);

  if (!carAsset) {
    return res.json({ response: "Met deze auto kan niet meer geraced worden" });
  }

  if (user.cash < Number(price)) {
    return res.json({ response: "Je hebt niet genoeg geld contant." });
  }

  const [updated] = await User.update(
    { cash: user.cash - price },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (updated !== 1) {
    return res.json({ response: "Je hebt niet genoeg geld contant" });
  }

  if (isNaN(numParticipants) || numParticipants < 2 || numParticipants > 24) {
    return res.json({ response: "Ongeldig aantal participants" });
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

  res.json({ response: "De streetrace is aangemaakt", success: true });
};

const joinStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Message
) => {
  let { loginToken, streetraceId, carId } = req.body;

  if (!carId) {
    return res.json({ response: "Geef een auto op" });
  }

  if (!streetraceId) {
    return res.json({ response: "Geef een streetrace op" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  const car = await Garage.findOne({ where: { id: carId, userId: user.id } });

  if (!car) {
    return res.json({ response: "Kon auto niet vinden" });
  }
  if (car.power < 1) {
    return res.json({ response: "Je auto heeft niet genoeg power" });
  }

  const carAsset = cars.find((c) => c.url === car.image);

  if (!carAsset) {
    return res.json({ response: "Met deze auto kan niet meer geraced worden" });
  }

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: "Kon streetrace niet vinden" });
  }

  const alreadyParticipant = await StreetraceParticipant.findOne({
    where: { streetraceId, name: user.name },
  });
  if (alreadyParticipant) {
    return res.json({ response: "Je doet al mee aan deze streetrace" });
  }

  if (streetrace.city !== user.city) {
    return res.json({ response: "Je bent niet in de goede stad" });
  }

  if (user.cash < Number(streetrace.price)) {
    return res.json({ response: "Je hebt niet genoeg geld contant." });
  }

  const [updated] = await User.update(
    { cash: user.cash - streetrace.price },
    { where: { id: user.id, cash: { [Op.gte]: streetrace.price } } }
  );

  if (updated !== 1) {
    return res.json({ response: "Je hebt niet genoeg geld contant" });
  }

  const typePower = carAsset[`power_${streetrace.type}`];

  StreetraceParticipant.create({
    streetraceId: streetrace.id,
    name: user.name,
    car: car.auto,
    image: car.image,
    power: car.power * typePower,
  });

  res.json({ response: "Je hebt deelgenomen", success: true });
};

const leaveStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Message
) => {
  let { loginToken, streetraceId } = req.body;

  if (!streetraceId) {
    return res.json({ response: "Geef een streetrace op" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: "Kon streetrace niet vinden" });
  }

  const participant = await StreetraceParticipant.findOne({
    where: { name: user.name, streetraceId: streetrace.id },
  });

  if (!participant) {
    return res.json({ response: "Je zit niet in deze streetrace" });
  }

  const destroyed = await StreetraceParticipant.destroy({
    where: { id: participant.id },
  });

  if (destroyed === 0) {
    return res.json({ response: "Je zit niet in deze streetrace" });
  }

  const [updated] = await User.update(
    { cash: Sequelize.literal(`cash + ${streetrace.price}`) },
    { where: { id: user.id } }
  );

  res.json({ response: "Je hebt de streetrace verlaten", success: true });
};

const startStreetrace = async (
  req,
  res,
  User,
  Streetrace,
  StreetraceParticipant,
  Garage,
  Message
) => {
  let { loginToken, streetraceId } = req.body;

  if (!streetraceId) {
    return res.json({ response: "Geef een streetrace op" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  const streetrace = await Streetrace.findOne({ where: { id: streetraceId } });

  if (!streetrace) {
    return res.json({ response: "Kon streetrace niet vinden" });
  }

  const participant = await StreetraceParticipant.findOne({
    where: { name: user.name, streetraceId: streetrace.id },
  });

  if (!participant) {
    return res.json({ response: "Je zit niet in deze streetrace" });
  }

  const participants = await StreetraceParticipant.findAll({
    where: { streetraceId: streetrace.id },
  });

  if (participants.length < streetrace.numParticipants) {
    return res.json({ response: "Deze streetrace zit nog niet vol." });
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
    return res.json({ response: "Er ging iets fout" });
  }

  const streetraceDestroyed = await Streetrace.destroy({
    where: { id: streetrace.id },
  });

  if (streetraceDestroyed === 0) {
    return res.json({ response: "Deze streetrace is al gereden." });
  }
  const prizeMoney = streetrace.price * streetrace.numParticipants;

  User.update(
    { bank: Sequelize.literal(`bank + ${prizeMoney}`) },
    { where: { name: winner.name } }
  );

  const report = `De streetrace is gereden!

${participantsCum.map((p) => `${p.name} deed mee met een ${p.car}.`).join("\n")}
  
De winnaar is ${winner.name}. ${winner.name} wint €${prizeMoney},-`;

  participantsCum.forEach(async (p) => {
    const participantUser = await User.findOne({ where: { name: p.name } });
    if (participantUser) {
      sendMessageAndPush(
        { id: 0, name: "(System)" },
        participantUser,
        report,
        Message,
        true
      );
    }
  });

  //delete streetrace
  //delete participants
  //if delete streetrace is succesful, give winner pricemoney

  res.json({
    response:
      "Je hebt de streetrace gestart. Ga naar berichten om het resultaat te zien.",
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
