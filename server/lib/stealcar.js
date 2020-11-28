const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
const {
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
  getTextFunction,
  getLocale,
} = require("./util");
const cars = require("../assets/cars.json");
let getText = getTextFunction();
const { isHappyHour } = require("./util");
function randomEntry(array) {
  return array[Math.floor(array.length * Math.random())];
}

const stealcar = async (req, res, User, Garage, Action) => {
  const { token, option, captcha } = req.body;

  const happyHourFactor = isHappyHour() ? 2 : 1;

  if (!token) {
    console.log("token", req);
    res.json({ response: getText("noToken") });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: getText("accountNotVerified") });
  }

  if (!option || option <= 0 || option > 15) {
    res.json({ response: getText("invalidInput") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
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
    const carsAlready = await Garage.findAll({ where: { userId: user.id } });
    const amountCarsAlready = carsAlready.length;
    const maxCars = {
      0: 0,
      1: 1,
      2: 4,
      3: 10,
      4: 25,
      5: 75,
      6: 250,
    };

    if (maxCars[user.garage] < amountCarsAlready) {
      return res.json({
        response: getText("stealCarTooManyCars", maxCars[user.garage]),
      });
    }

    if (user.autostelenAt + 60000 < Date.now()) {
      const kans = Math.round((user.rank + 30) / (option * option));
      const kans2 = kans > 75 ? 75 : kans;

      const random = Math.ceil(Math.random() * 100);

      const [updated] = await User.update(
        {
          autostelenAt: Date.now(),
          onlineAt: Date.now(),
          needCaptcha: needCaptcha(),
          numActions: Sequelize.literal(`numActions+1`),
          captcha: null,
        },
        {
          where: {
            loginToken: token,
            autostelenAt: { [Op.lt]: Date.now() - 60000 },
          },
        }
      );

      if (!updated) {
        return res.json({ response: getText("couldntUpdateUser") });
      }

      Action.create({
        userId: user.id,
        action: "stealcar",
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

        const carsArray = [];
        let n = (accomplices.length + 1) * happyHourFactor;
        while (n--) carsArray.push({ car: true });

        const allCars = carsArray.map((a) => {
          const car = randomEntry(
            cars.filter(
              (car) =>
                Number(car.id) > option * 7 - 7 && Number(car.id) < option * 7
            )
          );

          const created = Garage.create({
            userId: user.id,
            date: Date.now(),
            auto: car.naam,
            image: car.url,
            cash: car.waarde,
            power: 0,
            kogels: car.kogels,
          });

          User.update(
            {
              rank: user.rank + option * 3,
              gamepoints: user.gamepoints + 1,
              prizesCarsStolen: user.prizesCarsStolen + 1,
            },
            { where: { loginToken: token } }
          );

          return car;
        });

        res.json({
          response: getText("success"),
          cars: allCars,
        });
      } else {
        const random2 = Math.ceil(Math.random() * 100);

        if (random2 > 50) {
          const seconden = 90;
          User.update(
            { jailAt: Date.now() + seconden * 1000 },
            { where: { id: user.id } }
          );
          res.json({
            response: getText("stealCarJail", seconden),
          });
        } else {
          const locale = getLocale(user.locale);
          let texts = [];
          if (locale === "nl") {
            texts = require("../assets/carsTexts_nl.json");
          } else {
            texts = require("../assets/carsTexts_en.json");
          }

          const textsOption = texts.filter(
            (text) => text.optie === String(option)
          );
          const random = randomEntry(textsOption);
          res.json({ response: random.text });
        }
      }
    } else {
      const sec = Math.round((user.autostelenAt + 60000 - Date.now()) / 1000);

      res.json({
        response: getText("stealCarWait", sec),
      });
    }
    //create activity with all variables
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { stealcar };
