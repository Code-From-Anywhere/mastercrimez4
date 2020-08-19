const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
const { needCaptcha, NUM_ACTIONS_UNTIL_VERIFY } = require("./util");

const crime = async (req, res, User) => {
  const { token, option, captcha } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  if (!option || option <= 0 || option > 15) {
    res.json({ response: "Ongeldige invoer" + option });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: "Je moet je account eerst verifiëren!" });
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    if (user.needCaptcha && Number(captcha) !== user.captcha) {
      return res.json({ response: "Verkeerde code!" });
    }
    if (user.crimeAt + 60000 < Date.now()) {
      const kans = Math.round((user.rank + 30) / (option * option));
      const kans2 = kans > 75 ? 75 : kans;

      const random = Math.ceil(Math.random() * 100);

      const [updated] = await User.update(
        {
          crimeAt: Date.now(),
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
        return res.json({ response: "Kon jouw user niet updaten" });
      }

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

        const stolen = Math.ceil(
          Math.random() * option * 10000 * (accomplices.length + 1)
        );
        User.update(
          {
            rank: user.rank + option * 3,
            cash: user.cash + stolen,
            gamepoints: user.gamepoints + 1,
          },
          { where: { loginToken: token } }
        );

        res.json({
          response: `Gelukt. Je hebt €${stolen},- gejat`,
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
          res.json({ response: "Mislukt" });
        }
      }
    } else {
      res.json({
        response: `Je moet een minuut wachten.  Nog ${Math.round(
          (user.crimeAt + 60000 - Date.now()) / 1000
        )} seconden`,
      });
    }
    //create activity with all variables
  } else {
    res.json({ response: "Invalid token" });
  }
};

module.exports = { crime };
