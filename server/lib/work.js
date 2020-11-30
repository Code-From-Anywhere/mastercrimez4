const { Sequelize, Op } = require("sequelize");
const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
const moment = require("moment");
const { doGangMission } = require("./gang");
let getText = getTextFunction();

const workReleaseDate = moment("15/04/2021", "DD/MM/YYYY").set("hour", 17);

const work = async (req, res, User, Action, Gang, GangMission) => {
  let { token, option, captcha } = req.body;

  option = Math.round(option);

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!option || option < 1 || option > 7) {
    res.json({ response: getText("invalidInput") });
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

  if (moment().isBefore(workReleaseDate) && user.level < 2) {
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

  if (user.workEndsAt > Date.now()) {
    const minute = Math.round((user.workEndsAt - Date.now()) / (60 * 1000));
    return res.json({
      response: getText("workWait", minute),
    });
  }

  if (user.isWorkingOption) {
    return res.json({ response: getText("stillWorking") });
  }
  const hours = option <= 6 ? option : 8; //lol

  const [updated] = await User.update(
    {
      workEndsAt: Date.now() + 3600000 * hours,
      isWorkingOption: option,
      onlineAt: Date.now(),
      captcha: null,
      needCaptcha: needCaptcha(),
      numActions: Sequelize.literal(`numActions+1`),
    },
    {
      where: {
        loginToken: token,
        workEndsAt: { [Op.lt]: Date.now() },
      },
    }
  );

  if (!updated) {
    return res.json({ response: getText("couldntUpdateUser") });
  }

  doGangMission({ Gang, GangMission, amount: 1, user, what: "work" });

  Action.create({
    userId: user.id,
    action: "work",
    timestamp: Date.now(),
  });

  res.json({ response: getText("workSuccess") });
};

module.exports = { work };
