const { Op } = require("sequelize");
const swissBank = async (req, res, User) => {
  const { token, amount, deposit, type } = req.body;

  if (type !== "bullets" && type !== "bank") {
    return res.json({ response: "Verkeerde type" });
  }
  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: "Ongeldig bedrag" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
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
          [key2]: Math.round(Number(user[key2]) + Number(amount)),
        },
        { where: { id: user.id, [key]: { [Op.gte]: amount } } }
      );
      if (updated[0] === 1) {
        const typeString = type === "bullets" ? "kogels" : "bankgeld";
        const what = deposit ? "gestort" : "opgenomen";
        res.json({ response: `Je hebt ${amount} ${typeString} ${what}` });
      } else {
        res.json({ response: "Er ging iets mis" });
      }
    } else {
      res.json({ response: "Je hebt niet zoveel." });
    }
  } else {
    res.json({ response: "Ongeldige user" });
  }
};

module.exports = { swissBank };
