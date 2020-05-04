const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");

const cars = require("../assets/cars.json");
const texts = require("../assets/carsTexts.json");

function randomEntry(array) {
  return array[Math.floor(array.length * Math.random())];
}

const stealcar = async (req, res, User, Garage) => {
  const { token, option, captcha } = req.body;

  const secret_key = process.env.GOOGLE_CAPTCHA_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captcha}`;

  const robot = await fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      return google_response;
    })
    .catch((error) => res.json({ error }));

  if (!robot.success || robot.score < 0.3) {
    res.json({ response: "Je bent helaas gepakt door de robot-detectie!" });
    return;
  }

  if (!token) {
    console.log("token", req);
    res.json({ response: "Geen token" });
    return;
  }

  if (!option || option <= 0 || option > 15) {
    res.json({ response: "Ongeldige invoer" + option });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    if (user.autostelenAt + 60000 < Date.now()) {
      const kans = Math.round((user.rank + 30) / (option * option));
      const kans2 = kans > 75 ? 75 : kans;

      const random = Math.ceil(Math.random() * 100);

      User.update(
        { autostelenAt: Date.now() },
        { where: { loginToken: token } }
      );
      if (kans2 >= random) {
        const accomplices = await User.findAll({
          attributes: ["name"],
          where: Sequelize.and(
            { onlineAt: { [Op.gt]: Date.now() - 300000 } },
            Sequelize.or(
              { accomplice: user.name },
              { accomplice2: user.name },
              { accomplice3: user.name },
              { accomplice4: user.name }
            )
          ),
        });

        const allCars = accomplices.concat([{ name: user.name }]).map((a) => {
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
            { rank: user.rank + option * 3, gamepoints: user.gamepoints + 1 },
            { where: { loginToken: token } }
          );

          return car;
        });

        res.json({
          response: "Gelukt",
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
            response: `Mislukt, je zit nu voor ${seconden} seconden in de gevangenis`,
          });
        } else {
          const textsOption = texts.filter(
            (text) => text.optie === String(option)
          );
          const random = randomEntry(textsOption);
          res.json({ response: random.text });
        }
      }
    } else {
      res.json({
        response: `Je moet een minuut wachten.  Nog ${Math.round(
          (user.autostelenAt + 60000 - Date.now()) / 1000
        )} seconden`,
      });
    }
    //create activity with all variables
  } else {
    res.json({ response: "Invalid token" });
  }
};

module.exports = { stealcar };
