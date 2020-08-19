const { Op } = require("sequelize");
const bank = async (req, res, User) => {
  const { token, amount, deposit } = req.body;

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
    if (user.jailAt > Date.now()) {
      return res.json({ response: "Je zit in de bajes." });
    }

    if (user.health === 0) {
      return res.json({ response: "Je bent dood." });
    }

    if (user.reizenAt > Date.now()) {
      return res.json({ response: "Je bent aan het reizen." });
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
        const what = deposit ? "gestort" : "gepint";
        res.json({ response: `Je hebt ${amount},- ${what}` });
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

module.exports = { bank };
