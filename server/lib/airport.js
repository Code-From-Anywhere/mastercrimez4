const cities = require("../assets/airport.json");

const airport = async (req, res, User) => {
  const { token, to } = req.body;

  if (!cities.includes(to)) {
    res.json({ response: "Deze stad is ongeldig" });
    return;
  }

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (user.airplane === 0) {
    res.json({ response: "Je hebt geen vliegtuig!" });
    return;
  }

  const times = [0, 180, 120, 90, 60, 30, 20, 10];
  const time = times[user.airplane];
  const costs = [0, 5000, 10000, 15000, 25000, 50000, 100000, 200000];
  const cost = costs[user.airplane];

  if (user.cash < cost) {
    res.json({
      response: `Je hebt niet genoeg geld contant, het kost ${cost}`,
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

  res.json({
    response: `Je reist nu met je vliegtuig naar ${to}. Het duurt ${time} seconden.`,
  });
};

module.exports = { airport };
