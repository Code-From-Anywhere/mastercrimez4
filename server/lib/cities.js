const {
  getRank,
  getTextFunction,
  publicUserFields,
  properties,
} = require("./util");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");
const cities = async (req, res, City) => {
  res.json({ cities: await City.findAll({ order: [["city", "asc"]] }) });
};
const releaseDate = moment("01/01/2021", "DD/MM/YYYY");

let getText = getTextFunction();
const buildings = properties
  .map((p) => p.name)
  .concat(["house", "headquarter"]);
const areas = async (req, res, { City, MapArea, User, Gang }) => {
  let { city } = req.query;
  const cities = await City.findAll({});
  city = cities.map((c) => c.city).includes(city) ? city : cities[0].city;

  res.json({
    areas: await MapArea.findAll({
      where: { city },
      include: [
        {
          model: User,
          attributes: publicUserFields,
          include: { model: Gang, attributes: ["id", "name", "thumbnail"] },
        },
      ],
    }),
  });
};

const moveBuilding = async (req, res, User, City) => {
  const { loginToken, type, latitude, longitude } = req.body;

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

  if (user.level < 5) {
    return res.json({ response: getText("noAccess") });
  }

  if (!buildings.includes(type)) {
    return res.json({ response: getText("invalidValues") });
  }

  const areaCode = null; //maak dit nog zodra ik het nodig heb

  City.update(
    {
      [`${type}Latitude`]: latitude,
      [`${type}Longitude`]: longitude,
      [`${type}AreaCode`]: areaCode,
    },
    { where: { city: user.city } }
  );

  res.json({ success: true, response: getText("success") });
};

const takeEmptyArea = async (req, res, { User, City, MapArea, Gang }) => {
  const { loginToken, id } = req.body;

  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  if (!id) {
    return res.json({ response: getText("invalidValues") });
  }

  const area = await MapArea.findOne({ where: { id } });
  if (!area) {
    return res.json({ response: getText("invalidValues") });
  }

  const city = await City.findOne({ where: { city: area.city } });
  if (!city) {
    return res.json({ response: getText("invalidValues") });
  }

  const releaseThisCity = moment(releaseDate).add(city.id, "weeks");

  if (releaseThisCity.isAfter(moment())) {
    return res.json({
      response: getText("cityRelease", releaseThisCity.format("DD/MM/YYYY")),
    });
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

  const [updated] = await MapArea.update(
    {
      userId: user.id,
    },
    { where: { id, userId: null } }
  );

  if (!updated) {
    return res.json({ response: getText("noAccess") });
  }

  res.json({ success: true, response: getText("success") });
};

const repairMyArea = async (req, res, { User, City, MapArea, Gang }) => {
  const { loginToken, id } = req.body;

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

  const [updated] = await MapArea.update(
    { damage: 0 },
    { where: { id, userId: user.id, damage: { [Op.gt]: 0 } } }
  );

  if (!updated) {
    return res.json({ response: getText("invalidValues") });
  }

  res.json({ success: true, response: getText("success") });
};

module.exports = { cities, moveBuilding, areas, takeEmptyArea, repairMyArea };
