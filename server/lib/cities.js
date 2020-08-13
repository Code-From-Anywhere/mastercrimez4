const { getRank } = require("./util");
const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");

const cities = async (req, res, City) => {
  res.json({ cities: await City.findAll({}) });
};

module.exports = { cities };
