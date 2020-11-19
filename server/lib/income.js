const { Sequelize } = require("sequelize");
const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
let getText = getTextFunction();

const income = async (req, res, sequelize, User, City, Action) => {
  const { token, captcha } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

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

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
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
      onlineAt: Date.now(),
      cash: user.cash + amount,
      captcha: null,
      needCaptcha: needCaptcha(),
    },
    { where: { id: user.id, incomeAt: user.incomeAt } }
  );

  if (!updated) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  Action.create({
    userId: user.id,
    action: "income",
    timestamp: Date.now(),
  });

  City.update(
    {
      rldProfit: Sequelize.literal(`rldProfit + ${rldProfit}`),
      junkiesProfit: Sequelize.literal(`junkiesProfit + ${junkiesProfit}`),
      landlordProfit: Sequelize.literal(`landlordProfit + ${landlordProfit}`),
    },
    { where: { city: user.city } }
  );

  res.json({ response: getText("incomeSuccess", amount) });
};

module.exports = { income };
