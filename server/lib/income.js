const { Sequelize } = require("sequelize");

const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
let getText = getTextFunction();

const income = async (req, res, sequelize, User, City, Action, MapArea) => {
  let { token, captcha, type } = req.body;
  const types = ["junkies", "rld", "landlord"];
  if (!types.includes(type)) {
    type = "junkies";
  }

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

  const key = `${type}IncomeAt`;
  const incomeAt = user[key] ? user[key] : 0;
  const uren = Math.floor((Date.now() - incomeAt) / 3600000);
  const uren2 = uren > 24 ? 24 : uren;

  const yourAreas = await MapArea.findAll({ where: { userId: user.id } });

  const maxAmount = 2000 * yourAreas.length;

  const whatString =
    type === "rld"
      ? getText("prostitutes")
      : type === "junkies"
      ? getText("junkies")
      : getText("weedplants");
  let amountOfType =
    type === "junkies"
      ? user.junkies
      : type === "rld"
      ? user.hoeren
      : user.wiet;

  const tooManyMessage = "";
  if (amountOfType > maxAmount) {
    tooManyMessage = getText(
      "tooManyForIncome",
      yourAreas.length,
      maxAmount,
      whatString
    );
    amountOfType = maxAmount;
  }

  const rldMultiplier = user.profession === "pimp" ? 1.2 : 1;
  const landlordMultiplier = user.profession === "weedgrower" ? 1.2 : 1;
  const multiplier =
    type === "junkies"
      ? 1
      : type === "rld"
      ? rldMultiplier
      : landlordMultiplier;

  const amount = Math.round(amountOfType * 50 * Math.sqrt(uren2) * multiplier);

  const junkiesProfit = Math.round(user.junkies * 10 * Math.sqrt(uren2));
  const rldProfit = Math.round(user.hoeren * 10 * Math.sqrt(uren2));
  const landlordProfit = Math.round(user.wiet * 10 * Math.sqrt(uren2));

  const [updated] = await User.update(
    {
      numActions: Sequelize.literal(`numActions+1`),
      [key]: Date.now(),
      onlineAt: Date.now(),
      cash: user.cash + amount,
      captcha: null,
      needCaptcha: needCaptcha(),
    },
    { where: { id: user.id, [key]: user[key] } }
  );

  if (!updated) {
    return res.json({ response: getText("somethingWentWrong") });
  }

  Action.create({
    userId: user.id,
    action: "income",
    timestamp: Date.now(),
  });

  const cityUpdate = {};

  if (type === "junkies") {
    cityUpdate.junkiesProfit = Sequelize.literal(
      `junkiesProfit + ${junkiesProfit}`
    );
  } else if (type === "landlord") {
    cityUpdate.landlordProfit = Sequelize.literal(
      `landlordProfit + ${landlordProfit}`
    );
  } else {
    cityUpdate.rldProfit = Sequelize.literal(`rldProfit + ${rldProfit}`);
  }

  City.update(cityUpdate, { where: { city: user.city } });

  res.json({ response: getText("incomeSuccess", amount) + tooManyMessage });
};

module.exports = { income };
