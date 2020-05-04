const items = require("../assets/shop.json");
const { Op } = require("sequelize");

const current = (type, user) =>
  items.filter((item) => item.type === type)[user[type] - 1];
const next = (type, user) =>
  items.filter((item) => item.type === type)[user[type]];

const shop = async (req, res, User) => {
  const { token, type } = req.query;

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    res.json({ current: current(type, user), next: next(type, user) });
  } else {
    res.json({ error: "no user found" });
  }
};

const buy = async (req, res, User) => {
  const { loginToken, type } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    const item = next(type, user);

    if (!item) {
      res.json({ response: "Dat ding bestaat niet" });
      return;
    }

    if (item.price > user.cash) {
      res.json({ response: "Je hebt niet genoeg geld contant" });
      return;
    }

    const updated = await User.update(
      {
        [type]: user[type] + 1,
        rank: user.rank + user[type] * 100,
        cash: user.cash - item.price,
      },
      { where: { id: user.id, cash: { [Op.gte]: item.price } } }
    );

    if (updated[0] === 1) {
      res.json({ response: "Gekocht" });
    } else {
      res.json({ response: "Er ging iets fout" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { shop, buy };
