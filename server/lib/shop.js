const items = require("../assets/shop.json");
const { Op, Sequelize } = require("sequelize");
const PERCENTAGE_FOR_OWNER = 0.2;

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

const buy = async (req, res, User, City) => {
  const { loginToken, type } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    const item = next(type, user);

    if (user.jailAt > Date.now()) {
      return res.json({ response: "Je zit in de bajes." });
    }

    if (user.health === 0) {
      return res.json({ response: "Je bent dood." });
    }

    if (user.reizenAt > Date.now()) {
      return res.json({ response: "Je bent aan het reizen." });
    }

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
      const weaponShopProfit =
        type === "weapon" || type === "protection"
          ? Math.round(item.price * PERCENTAGE_FOR_OWNER)
          : 0;
      const airportProfit =
        type === "airplane" ? Math.round(item.price * PERCENTAGE_FOR_OWNER) : 0;
      const estateAgentProfit =
        type === "home" ? Math.round(item.price * PERCENTAGE_FOR_OWNER) : 0;
      const garageProfit =
        type === "garage" ? Math.round(item.price * PERCENTAGE_FOR_OWNER) : 0;

      City.update(
        {
          weaponShopProfit: Sequelize.literal(
            `weaponShopProfit + ${weaponShopProfit}`
          ),
          airportProfit: Sequelize.literal(`airportProfit + ${airportProfit}`),
          estateAgentProfit: Sequelize.literal(
            `estateAgentProfit + ${estateAgentProfit}`
          ),
          garageProfit: Sequelize.literal(`garageProfit + ${garageProfit}`),
        },
        { where: { city: user.city } }
      );

      res.json({ response: "Gekocht" });
    } else {
      res.json({ response: "Er ging iets fout" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { shop, buy };
