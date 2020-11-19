const items = require("../assets/shop.json");
const { Op, Sequelize } = require("sequelize");
const PERCENTAGE_FOR_OWNER = 0.2;
const { getTextFunction } = require("./util");

let getText = getTextFunction();

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
    res.json({ error: getText("invalidUser") });
  }
};

const buy = async (req, res, User, City) => {
  const { loginToken, type } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    getText = getTextFunction(user.locale);

    const item = next(type, user);

    if (user.jailAt > Date.now()) {
      return res.json({ response: getText("youreInJail") });
    }

    if (user.health === 0) {
      return res.json({ response: getText("youreDead") });
    }

    if (user.reizenAt > Date.now()) {
      return res.json({ response: getText("youreTraveling") });
    }

    if (!item) {
      res.json({ response: getText("itemDoesntExist") });
      return;
    }

    if (item.price > user.cash) {
      res.json({ response: getText("notEnoughCash", item.price) });
      return;
    }

    const updated = await User.update(
      {
        [type]: user[type] + 1,
        rank: user.rank + user[type] * 100,
        cash: user.cash - item.price,
        onlineAt: Date.now(),
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

      res.json({ response: getText("shopSuccess") });
    } else {
      res.json({ response: getText("somethingWentWrong") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { shop, buy };
