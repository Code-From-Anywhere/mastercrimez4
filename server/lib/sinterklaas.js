const { Sequelize, Op } = require("sequelize");
const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
const moment = require("moment");
let getText = getTextFunction();

const isPossible =
  moment().year() > 2020 &&
  ((moment().month() === 10 && moment().date() > 15) ||
    (moment().month() === 11 && moment().date() < 6)); //15 november tot 6 december

const sint = async (req, res, User, Action) => {
  let { token, captcha } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (!isPossible && user.level < 2) {
    return res.json({ response: getText("noAccess") });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  if (user.sintEndsAt > Date.now()) {
    const minute = Math.round((user.sintEndsAt - Date.now()) / (60 * 1000));
    return res.json({
      response: getText("sintWait", minute),
    });
  }

  if (user.isSint) {
    return res.json({ response: getText("stillSint") });
  }

  const [updated] = await User.update(
    {
      sintEndsAt: Date.now() + 3600000 * 24,
      isSint: true,
      onlineAt: Date.now(),
      captcha: null,
      needCaptcha: needCaptcha(),
      numActions: Sequelize.literal(`numActions+1`),
    },
    {
      where: {
        loginToken: token,
        sintEndsAt: { [Op.lt]: Date.now() },
      },
    }
  );

  if (!updated) {
    return res.json({ response: getText("couldntUpdateUser") });
  }

  Action.create({
    userId: user.id,
    action: "sint",
    timestamp: Date.now(),
  });

  res.json({ response: getText("sintSuccess") });
};

module.exports = { sint };
