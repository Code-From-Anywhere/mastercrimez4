const { Op, Sequelize } = require("sequelize");
const { sendMessageAndPush } = require("./util");

const typeStrings = {
  bulletFactory: "Kogelfabriek",
  casino: "Casino",
  landlord: "Huisjesmelker",
  junkies: "Leger des Heils",
  weaponShop: "Wapenwinkel",
  rld: "Red light district",
  airport: "Vliegveld",
  estateAgent: "Makelaarskantoor",
  bank: "Zwitserse Bank",
  jail: "Gevangenis",
  garage: "Garage",
};

const properties = [
  {
    name: "bulletFactory",
    changePrice: true,
    maxPrice: 100,
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

const becomeOwner = async (req, res, User, City) => {
  const { city, type, token } = req.body;

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
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

  const cityObj = await City.findOne({ where: { city } });

  if (!cityObj) {
    return res.json({ response: "Stad niet gevonden" });
  }

  const key = properties.map((p) => p.name).includes(type)
    ? `${type}Owner`
    : null;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }

  const [cityUpdated] = await City.update(
    { [key]: user.name },
    { where: { city: cityObj.city, [key]: null } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Deze bezitting heeft al een eigenaar." });
  }

  res.json({ response: "Je bent nu eigenaar" });
};

const giveAway = async (req, res, User, City, Message) => {
  const { city, type, token, to } = req.body;

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", to)
      ),
      health: { [Op.gt]: 0 },
    },
  });

  if (!user2) {
    return res.json({ response: "Deze speler bestaat niet of is dood" });
  }

  const key = properties.map((p) => p.name).includes(type)
    ? `${type}Owner`
    : null;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }

  const cityObj = await City.findOne({ where: { city, [key]: user.name } });

  if (!cityObj) {
    return res.json({ response: "Object niet gevonden" });
  }

  const [cityUpdated] = await City.update(
    { [key]: user2.name },
    { where: { city: cityObj.city, [key]: user.name } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Je kan deze bezitting niet weggeven." });
  }

  const typeString = typeStrings[type];
  sendMessageAndPush(
    user,
    user2,
    `${user.name} heeft jou een ${typeString} gegeven in ${city}!`,
    Message,
    true
  );

  res.json({ response: `De eigenaar is nu ${user2.name}` });
};

const changePrice = async (req, res, User, City) => {
  let { city, type, token, price } = req.body;

  price = Math.round(Number(price));

  if (isNaN(price) || price <= 0) {
    return res.json({ response: "Dat is geen geldig aantal" });
  }

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  const key = properties
    .filter((p) => p.changePrice)
    .map((p) => p.name)
    .includes(type)
    ? `${type}Price`
    : null;
  const ding = properties.find((x) => x.name === type);
  const maxPrice = ding ? ding.maxPrice : 0;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }

  const ownerKey = properties
    .filter((p) => p.changePrice)
    .map((p) => p.name)
    .includes(type)
    ? `${type}Owner`
    : null;

  const cityObj = await City.findOne({
    where: { city, [ownerKey]: user.name },
  });

  if (!cityObj) {
    return res.json({ response: "Object niet gevonden" });
  }

  if (price > maxPrice) {
    return res.json({ response: `De maximale prijs is ${maxPrice}` });
  }

  const [cityUpdated] = await City.update(
    { [key]: price },
    { where: { city: cityObj.city } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Er ging iets mis." });
  }

  res.json({ response: `De prijs is nu ${price}` });
};

const getProfit = async (req, res, sequelize, User, City) => {
  let { city, type, token } = req.body;

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  const key = properties.map((p) => p.name).includes(type)
    ? `${type}Profit`
    : null;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }
  const ownerKey = properties.map((p) => p.name).includes(type)
    ? `${type}Owner`
    : null;

  const cityObj = await City.findOne({
    where: { city, [ownerKey]: user.name },
  });

  if (!cityObj) {
    return res.json({ response: "Object niet gevonden" });
  }

  const [cityUpdated] = await City.update(
    { [key]: 0 },
    { where: { city: cityObj.city, [key]: { [Op.gt]: 0 } } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Je hebt geen winst." });
  }

  sequelize.query(
    `UPDATE users SET cash = cash+${cityObj[key]} WHERE id = ${user.id}`
  );

  res.json({ response: `Je hebt €${cityObj[key]},- opgehaald` });
};

const repairObject = async (req, res, sequelize, User, City) => {
  let { city, type, token } = req.body;

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  const key = properties.map((p) => p.name).includes(type)
    ? `${type}Damage`
    : null;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }
  const ownerKey = properties.map((p) => p.name).includes(type)
    ? `${type}Owner`
    : null;

  const cityObj = await City.findOne({
    where: { city, [ownerKey]: user.name },
  });

  if (!cityObj) {
    return res.json({ response: "Object niet gevonden" });
  }

  const [cityUpdated] = await City.update(
    { [key]: 0 },
    { where: { city: cityObj.city, [key]: { [Op.gt]: 0 } } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Je hebt geen schade." });
  }

  res.json({ response: `Je hebt je ${typeStrings[type]} gerepareerd.` });
};

const putInJail = async (req, res, User, City, Message) => {
  let { city, type, token, who } = req.body;

  if (!token) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken: token } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", who)
      ),
      health: { [Op.gt]: 0 },
    },
  });

  if (!user2) {
    return res.json({ response: "Deze speler bestaat niet of is dood" });
  }

  const key = ["jail"].includes(type) ? `${type}Profit` : null;

  if (!key) {
    return res.json({ response: "Ongeldig type" });
  }
  const ownerKey = ["jail"].includes(type) ? `${type}Owner` : null;

  const cityObj = await City.findOne({
    where: { city, [ownerKey]: user.name },
  });

  if (!cityObj) {
    return res.json({ response: "Object niet gevonden" });
  }

  if (cityObj.jailPutAt >= Date.now()) {
    const seconds = Math.round((cityObj.jailPutAt - Date.now()) / 1000);
    return res.json({
      response: `Je moet nog ${seconds} seconden wachten voordat je weer iemand in de gevangenis kan stoppen`,
    });
  }

  City.update(
    { jailPutAt: Date.now() + 600 * 1000 },
    { where: { city: cityObj.city } }
  );

  User.update({ jailAt: Date.now() + 300 * 1000 }, { where: { id: user2.id } });

  sendMessageAndPush(
    user,
    user2,
    `${user.name} heeft jou voor 5 minuten in de gevangenis gestopt`,
    Message,
    true
  );

  res.json({
    response: `Je hebt ${user2.name} in de gevangenis gestopt voor 5 minuten`,
  });
};

module.exports = {
  becomeOwner,
  giveAway,
  changePrice,
  getProfit,
  putInJail,
  repairObject,
};
