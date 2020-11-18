const cities = require("../assets/airport.json");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const airport = async (req, res, User, Action) => {
  const { token, to } = req.body;

  if (!cities.includes(to)) {
    res.json({ response: getText("invalidCity") });
    return;
  }

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

  if (user.airplane === 0) {
    res.json({ response: getText("noAirplane") });
    return;
  }

  const times = [0, 180, 120, 90, 60, 30, 20, 10];
  const time = times[user.airplane];
  const costs = [0, 5000, 10000, 15000, 25000, 50000, 100000, 200000];
  const cost = costs[user.airplane];

  if (user.cash < cost) {
    res.json({
      response: getText("notEnoughCash", cost),
    });
    return;
  }

  User.update(
    {
      city: to,
      reizenAt: Date.now() + time * 1000,
      cash: user.cash - cost,
      onlineAt: Date.now(),
    },
    { where: { id: user.id } }
  );

  Action.create({
    userId: user.id,
    action: "airport",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("airportSuccess", to, time),
  });
};

module.exports = { airport };
