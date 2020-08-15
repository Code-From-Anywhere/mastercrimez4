const { Op, Sequelize } = require("sequelize");

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
  let { loginToken, numParticipants, type, price } = req.body;
  numParticipants = Math.round(numParticipants);
  type = TYPES.includes(type) ? type : TYPES[0];

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

  const [updated] = await User.update(
    { cash: user.cash - amount },
    { where: { cash: { [Op.gte]: amount } } }
  );

  if (!updated) {
    return res.json({ response: "Je hebt niet genoeg geld contant" });
  }

  if (isNaN(numParticipants) || numParticipants < 1 || numParticipants > 24) {
    return res.json({ response: "Ongeldig aantal participants" });
  }
};

module.exports = {
  createStreetrace,
  joinStreetrace,
  leaveStreetrace,
  startStreetrace,
};
