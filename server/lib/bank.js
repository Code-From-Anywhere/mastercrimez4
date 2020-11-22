const { Op } = require("sequelize");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const bank = async (req, res, User, Action) => {
  const { token, amount, deposit } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: getText("invalidAmount") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
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

    const key = deposit ? "cash" : "bank";
    const key2 = deposit ? "bank" : "cash";

    if (user[key] >= amount) {
      const updated = await User.update(
        {
          [key]: Math.round(Number(user[key]) - Number(amount)),
          [key2]: Math.round(Number(user[key2]) + Number(amount)),
          onlineAt: Date.now(),
        },
        { where: { id: user.id, [key]: { [Op.gte]: amount } } }
      );
      if (updated[0] === 1) {
        Action.create({
          userId: user.id,
          action: "bank",
          timestamp: Date.now(),
        });

        const what = deposit
          ? getText("youHaveDeposited", amount)
          : getText("youHaveWithdrawn", amount);
        res.json({ response: what });
      } else {
        res.json({ response: getText("somethingWentWrong") });
      }
    } else {
      res.json({ response: getText("notEnoughMoney") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { bank };
