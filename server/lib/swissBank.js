const { Op } = require("sequelize");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const swissBank = async (req, res, User, Action) => {
  const { token, amount, deposit, type } = req.body;

  if (type !== "bullets" && type !== "bank") {
    return res.json({ response: getText("invalidType") });
  }
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

    const key =
      type === "bullets"
        ? deposit
          ? "bullets"
          : "swissBullets"
        : deposit
        ? "bank"
        : "swissBank";
    const key2 =
      type === "bullets"
        ? deposit
          ? "swissBullets"
          : "bullets"
        : deposit
        ? "swissBank"
        : "bank";

    if (user[key] >= amount) {
      const updated = await User.update(
        {
          [key]: Math.round(Number(user[key]) - Number(amount)),
          [key2]: Math.round(Number(user[key2]) + Number(amount * 0.95)),
          onlineAt: Date.now(),
        },
        { where: { id: user.id, [key]: { [Op.gte]: amount } } }
      );
      if (updated[0] === 1) {
        Action.create({
          userId: user.id,
          action: "swissbank",
          timestamp: Date.now(),
        });

        const typeString =
          type === "bullets" ? getText("bullets") : getText("bankMoney");
        const what = deposit ? getText("bankGiven") : getText("bankTaken");
        res.json({
          response: getText("bankSuccess", amount, typeString, what),
        });
      } else {
        res.json({ response: getText("somethingWentWrong") });
      }
    } else {
      res.json({ response: getText("notEnough") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { swissBank };
