const items = require("../assets/creditshop.json");
const { Op } = require("sequelize");

const creditshop = async (req, res, User) => {
  res.json({ items });
};

const creditshopBuy = async (req, res, User) => {
  const { loginToken, type } = req.body;
  if (!loginToken) {
    return res.json({ response: "Geen token" });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    const item = items.find((i) => i.id === type);

    if (!item) {
      res.json({ response: "Dat ding bestaat niet" });
      return;
    }

    if (item.kosten > user.credits) {
      res.json({ response: "Je hebt niet genoeg credits" });
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
      res.json({ response: item.gekochttext });
    } else {
      res.json({ response: "Er ging iets fout" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { creditshop, creditshopBuy };
