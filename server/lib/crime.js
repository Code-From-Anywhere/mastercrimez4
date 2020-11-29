const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  getSpecial,
} = require("./util");
const moment = require("moment");
const { isHappyHour } = require("./util");
let getText = getTextFunction();

const crime = async (req, res, User, Action, Code) => {
  const { token, option, captcha } = req.body;
  const happyHourFactor = isHappyHour() ? 2 : 1;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!option || option <= 0 || option > 15) {
    res.json({ response: getText("invalidOption", option) });
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
    if (user.crimeAt + 60000 < Date.now()) {
      const kans = Math.round((user.rank + 30) / (option * option));
      const maxChance = user.profession === "thief" ? 99 : 75;
      const kans2 = kans > maxChance ? maxChance : kans;

      const random = Math.ceil(Math.random() * 100);

      if (user.jailAt > Date.now()) {
        return res.json({ response: getText("youreInJail") });
      }

      if (user.health === 0) {
        return res.json({ response: getText("youreDead") });
      }

      if (user.reizenAt > Date.now()) {
        return res.json({ response: getText("youreTraveling") });
      }

      const [updated] = await User.update(
        {
          crimeAt: Date.now(),
          onlineAt: Date.now(),
          captcha: null,
          needCaptcha: needCaptcha(),
          numActions: Sequelize.literal(`numActions+1`),
        },
        {
          where: {
            loginToken: token,
            crimeAt: { [Op.lt]: Date.now() - 60000 },
          },
        }
      );

      if (!updated) {
        return res.json({ response: getText("couldntUpdateUser") });
      }

      Action.create({
        userId: user.id,
        action: "crime",
        timestamp: Date.now(),
      });

      if (kans2 >= random) {
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

        const specialText = getSpecial(User, user);

        const stolen = Math.ceil(
          Math.random() *
            option *
            10000 *
            (accomplices.length + 1) *
            happyHourFactor
        );
        User.update(
          {
            rank: user.rank + option * 3,
            cash: user.cash + stolen,
            gamepoints: user.gamepoints + 1,
            prizesCrimes: user.prizesCrimes + 1,
          },
          { where: { loginToken: token } }
        );

        let code = null;
        const suitCase = Math.ceil(Math.random() * 100); //1-100
        if (suitCase <= 5) {
          //once every 20 crimes
          code = `${Math.round(Math.random() * 999999999)}`;
          const what = "cash";
          let amount = Math.round(Math.random() * 20) * 100000; //1 mil on average
          const mega = Math.random() < 0.01;
          if (mega) {
            amount = Math.round(Math.random() * 20) * 10000000;
          }
          //1% probability on 0-200mil, 99% probability on 0-2mil.. on average, this means 2mil per 20 crimes, so 100k per crime extra.
          Code.create({
            userId: user.id,
            code,
            title: "crime",
            validUntil: Date.now() + 86400000,
            what,
            amount,
          });
          res.json({
            response: getText("crimeSuccessSuitcase", stolen) + specialText,
            code,
          });
        } else {
          res.json({ response: getText("crimeSuccess", stolen) });
        }
      } else {
        const random2 = Math.ceil(Math.random() * 100);

        if (random2 > 50) {
          const seconden = 90;
          User.update(
            { jailAt: Date.now() + seconden * 1000 },
            { where: { id: user.id } }
          );
          res.json({
            response: getText("failAndJail", seconden),
          });
        } else {
          res.json({ response: getText("fail") });
        }
      }
    } else {
      const sec = Math.round((user.crimeAt + 60000 - Date.now()) / 1000);
      res.json({ response: getText("waitSeconds", sec) });
    }
    //create activity with all variables
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { crime };
