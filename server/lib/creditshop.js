const items = require("../assets/creditshop.json");
const { Op } = require("sequelize");
const { getTextFunction, getLocale } = require("./util");

let getText = getTextFunction();

const creditshop = async (req, res, User) => {
  res.json({ items });
};

const creditshopBuy = async (req, res, User) => {
  const { loginToken, type } = req.body;
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    getText = getTextFunction(user.locale);

    const item = items.find((i) => i.id === type);

    if (!item) {
      res.json({ response: getText("itemDoesntExist") });
      return;
    }

    if (item.kosten > user.credits) {
      res.json({ response: getText("notEnoughCredits") });
      return;
    }

    const [updated] = await User.update(
      {
        [item.wat]: user[item.wat] + item.hoeveel,
        credits: user.credits - item.kosten,
      },
      { where: { id: user.id, credits: { [Op.gte]: item.kosten } } }
    );

    if (updated === 1) {
      const locale = getLocale(user.locale);

      res.json({ response: item.gekochttext[locale] });
    } else {
      res.json({ response: getText("somethingWentWrong") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { creditshop, creditshopBuy };
