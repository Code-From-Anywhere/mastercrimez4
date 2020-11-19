const {
  getRank,
  getStrength,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
} = require("./util");
const { Sequelize, Op } = require("sequelize");
const fetch = require("isomorphic-fetch");

const SECONDS = 120;

let getText = getTextFunction();

const oc = async (req, res, User, Message, Action) => {
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
  if (isNotVerified) {
    return res.json({ response: getText("accountNotVerified") });
  }

  const timeNeeded = 120000;
  const timeKey = "ocAt";
  const valueKey = "cash";
  const name = "contant";

  const rang = getRank(user.rank, "number");

  if (user[timeKey] + timeNeeded < Date.now()) {
    const accomplicesTotal = await User.findAll({
      attributes: ["name"],
      where: Sequelize.or(
        { accomplice: user.name },
        { accomplice2: user.name },
        { accomplice3: user.name },
        { accomplice4: user.name }
      ),
    });

    if (accomplicesTotal.length === 0) {
      return res.json({
        response: getText("ocNoAccomplices"),
      });
    }

    const accomplices = await User.findAll({
      attributes: ["name"],
      where: Sequelize.and(
        { ocAt: { [Op.gt]: Date.now() - 120000 } },
        Sequelize.or(
          { accomplice: user.name },
          { accomplice2: user.name },
          { accomplice3: user.name },
          { accomplice4: user.name }
        )
      ),
    });

    const [updated] = await User.update(
      {
        captcha: null,
        onlineAt: Date.now(),
        needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
        [timeKey]: Date.now(),
      },
      {
        where: {
          loginToken: token,
          [timeKey]: { [Op.lt]: Date.now() - timeNeeded },
        },
      }
    );

    if (!updated) {
      return res.json({ response: getText("couldntUpdateUser") });
    }

    Action.create({
      userId: user.id,
      action: "oc",
      timestamp: Date.now(),
    });

    if (accomplices.length === 0) {
      const names = accomplicesTotal.map((acc) => acc.name).join(", ");

      return res.json({
        response: getText("ocSuccess1", names),
      });
    }

    const random = Math.ceil(Math.random() * 10000 * rang * accomplices.length);

    const names = accomplices.map((acc) => acc.name).join(", ");
    User.update(
      {
        [valueKey]: user[valueKey] + random,
        gamepoints: user.gamepoints + 1,
      },
      { where: { loginToken: token } }
    );

    res.json({
      response: getText("ocSuccess2", names, random, name),
    });
  } else {
    const sec = Math.round((user[timeKey] + timeNeeded - Date.now()) / 1000);
    res.json({
      response: getText("ocWait", sec),
    });
  }
  //create activity with all variables
};

module.exports = { oc };
