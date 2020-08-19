const {
  getRank,
  getStrength,
  sendMessageAndPush,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
} = require("./util");
const { Sequelize, Op } = require("sequelize");

const SECONDS = 30;

const rob = async (req, res, User, Message) => {
  const { token, name, captcha } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: "Verkeerde code!" });
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
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

  const now = Date.now();
  User.update({ robbedAt: now }, { where: { id: user2.id } });

  if (probability < random) {
    res.json({ response: "Het is mislukt" });
    User.update(
      {
        robAt: now,
        onlineAt: Date.now(),
        captcha: null,
        needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
      },
      {
        where: { id: user.id, robAt: { [Op.lt]: Date.now() - SECONDS * 1000 } },
      }
    );

    return;
  }

  const [gelukt] = await User.update(
    { cash: user2.cash - stealAmount },
    { where: { id: user2.id, cash: { [Op.gte]: stealAmount } } }
  );

  if (gelukt) {
    const [gelukt2] = await User.update(
      {
        cash: user.cash + stealAmount,
        robAt: now,
        captcha: null,
        needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
      },
      { where: { id: user.id, robAt: { [Op.lte]: now - SECONDS * 1000 } } }
    );

    if (gelukt2) {
      sendMessageAndPush(
        user,
        user2,
        `${user.name} heeft je beroofd en heeft ${stealAmount} van je gejat.`,
        Message,
        true
      );

      return res.json({
        response: `Het is gelukt! Je hebt ${stealAmount},- gejat.`,
      });
    }

    // console.log("gelukt", gelukt, "gelukt2", gelukt2);
  }
  return res.json({ response: "Er ging iets mis" });
};

module.exports = { rob };
