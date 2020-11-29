const {
  getRank,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  isHappyHour,
} = require("./util");
const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

const professionReleaseDate = moment("15/03/2021", "DD/MM/YYYY").set(
  "hour",
  17
);

let getText = getTextFunction();

const chooseProfession = async (req, res, User, Action) => {
  const { token, profession } = req.body;

  const PROFESSIONS = [
    "thief",
    "carthief",
    "weedgrower",
    "killer",
    "pimp",
    "banker",
    "jailbreaker",
  ];

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (moment().isBefore(professionReleaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }
  getText = getTextFunction(user.locale);

  if (!user.canChooseProfession) {
    return res.json({ response: getText("cantChooseProfession") });
  }

  if (!PROFESSIONS.includes(profession)) {
    return res.json({ response: getText("invalidValues") });
  }

  User.update(
    { profession, canChooseProfession: false },
    { where: { id: user.id } }
  );

  Action.create({
    userId: user.id,
    action: "chooseProfession",
    timestamp: Date.now(),
  });

  res.json({
    response: getText("chooseProfessionSuccess", getText(profession)),
  });
};

module.exports = { chooseProfession };
