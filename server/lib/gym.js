const {
  getRank,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
const { Sequelize, Op } = require("sequelize");
let getText = getTextFunction();

const gym = async (req, res, User, Action) => {
  const { token, option, captcha } = req.body;

  if (option < 1 || option > 3 || isNaN(option)) {
    res.json({ response: getText("invalidChoice") });
    return;
  }
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

    if (user.gymAt + user.gymTime < Date.now()) {
      const random = Math.ceil(
        Math.random() * 10 * option * getRank(user.rank, "number")
      );

      User.update(
        {
          captcha: null,
          needCaptcha: needCaptcha(),
          numActions: Sequelize.literal(`numActions+1`),
          gymAt: Date.now(),
          onlineAt: Date.now(),
          gymTime: 120000 * option,
          strength: user.strength + random,
          gamepoints: user.gamepoints + 1,
        },
        {
          where: {
            loginToken: token,
            gymAt: { [Op.lt]: Date.now() - user.gymTime },
          },
        }
      );

      Action.create({
        userId: user.id,
        action: "gym",
        timestamp: Date.now(),
      });

      res.json({ response: getText("gymSuccess", random) });
    } else {
      const sec = Math.round((user.gymAt + user.gymTime - Date.now()) / 1000);
      res.json({
        response: getText("gymWaitSeconds", sec),
      });
    }
    //create activity with all variables
  }
};

module.exports = { gym };
