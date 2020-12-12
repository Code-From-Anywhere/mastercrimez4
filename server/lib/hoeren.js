const {
  getRank,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  isHappyHour,
  getSpecial,
} = require("./util");
const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
let getText = getTextFunction();

const hoeren = async (req, res, User, Action) => {
  const { token, captcha } = req.body;

  const happyHourFactor = isHappyHour() ? 2 : 1;

  const timeNeeded = 120000;
  const timeKey = "hoerenAt";
  const valueKey = "hoeren";
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

  if (user) {
    getText = getTextFunction(user.locale);
    const name = getText("hoeren");

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

    const rang = getRank(user.rank, "number");

    if (user[timeKey] + timeNeeded < Date.now()) {
      const professionFactor = user.profession === "pimp" ? 1.3 : 1;

      const random = Math.ceil(
        Math.random() * 10 * rang * happyHourFactor * professionFactor
      );

      User.update(
        {
          numActions: Sequelize.literal(`numActions+1`),
          captcha: null,
          needCaptcha: needCaptcha(),
          [timeKey]: Date.now(),
          onlineAt: Date.now(),
          [valueKey]: user[valueKey] + random,
          gamepoints: user.gamepoints + 1,
        },
        {
          where: {
            loginToken: token,
            [timeKey]: { [Op.lt]: Date.now() - 120000 },
          },
        }
      );

      Action.create({
        userId: user.id,
        action: "hoeren",
        timestamp: Date.now(),
      });

      res.json({
        success: Math.ceil(Math.random() * 60),
        response:
          getText("hoerenSuccess", random, name) + getSpecial(User, user),
      });
    } else {
      const sec = Math.round((user[timeKey] + timeNeeded - Date.now()) / 1000);

      res.json({
        response: getText("hoerenWaitSeconds", sec),
      });
    }
    //create activity with all variables
  }
};

module.exports = { hoeren };
