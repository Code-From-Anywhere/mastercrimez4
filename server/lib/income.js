const { Sequelize } = require("sequelize");
const { needCaptcha, NUM_ACTIONS_UNTIL_VERIFY } = require("./util");

const income = async (req, res, sequelize, User, City) => {
  const { token, captcha } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
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

  const incomeAt = user.incomeAt ? user.incomeAt : 0;
  const uren = Math.round((Date.now() - incomeAt) / 3600000);
  const uren2 = uren > 24 ? 24 : uren;
  const amount = Math.round(
    (user.junkies + user.hoeren + user.wiet) * 50 * Math.sqrt(uren2)
  );

  const junkiesProfit = Math.round(user.junkies * 10 * Math.sqrt(uren2));
  const rldProfit = Math.round(user.hoeren * 10 * Math.sqrt(uren2));
  const landlordProfit = Math.round(user.wiet * 10 * Math.sqrt(uren2));

  const [updated] = await User.update(
    {
      numActions: Sequelize.literal(`numActions+1`),
      incomeAt: Date.now(),
      cash: user.cash + amount,
      captcha: null,
      needCaptcha: needCaptcha(),
    },
    { where: { id: user.id, incomeAt: user.incomeAt } }
  );

  if (!updated) {
    return res.json({ response: "Je kan nu geen inkomen ophalen" });
  }

  City.update(
    {
      rldProfit: Sequelize.literal(`rldProfit + ${rldProfit}`),
      junkiesProfit: Sequelize.literal(`junkiesProfit + ${junkiesProfit}`),
      landlordProfit: Sequelize.literal(`landlordProfit + ${landlordProfit}`),
    },
    { where: { city: user.city } }
  );

  res.json({
    response: `Je hebt inkomen opgehaald: ${amount}.`,
  });
};

module.exports = { income };
