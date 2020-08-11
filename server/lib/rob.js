const { getRank, getStrength } = require("./util");
const { Sequelize, Op } = require("sequelize");

const SECONDS = 30;

const rob = async (req, res, User, Message) => {
  const { token, name } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified) {
    return res.json({ response: "Je moet je account eerst verifiëren!" });
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", name)
      ),
    },
  });

  if (!user2) {
    res.json({ response: "Die persoon bestaat niet" });
    return;
  }

  if (user2.name === user.name) {
    res.json({ response: "Dat ben je zelf!" });
    return;
  }

  if (user.robAt + SECONDS * 1000 > Date.now()) {
    res.json({
      response: "Je moet nog even wachten voor je weer iemand kan beroven",
    });
    return;
  }

  if (user2.robbedAt + SECONDS * 1000 > Date.now()) {
    res.json({ response: "Deze persoon is net ook al beroofd" });
    return;
  }

  if (user2.bunkerAt > Date.now()) {
    res.json({ response: "Deze persoon zit in de schuilkelder" });
    return;
  }

  if (user.bunkerAt > Date.now()) {
    res.json({ response: "Vanuit de schuilkelder kan je niemand beroven" });
    return;
  }

  const stealAmount = Math.round(Math.random() * user2.cash);

  const meRank =
    getRank(user.rank, "number") + getStrength(user.strength, "number");
  const heRank =
    getRank(user2.rank, "number") + getStrength(user2.strength, "number");
  const probability = (meRank / heRank) * 30;
  const random = Math.round(Math.random() * 100);

  User.update({ robAt: Date.now() }, { where: { id: user.id } });
  User.update({ robbedAt: Date.now() }, { where: { id: user2.id } });

  if (probability < random) {
    res.json({ response: "Het is mislukt" });
    return;
  }

  User.update({ cash: user.cash + stealAmount }, { where: { id: user.id } });
  User.update({ cash: user2.cash - stealAmount }, { where: { id: user2.id } });
  Message.create({
    from: user.id,
    to: user2.id,
    fromName: "(System)",
    message: `${user.name} heeft je beroofd en heeft ${stealAmount} van je gejat.`,
  });
  res.json({ response: `Het is gelukt! Je hebt ${stealAmount},- gejat.` });
};

module.exports = { rob };
