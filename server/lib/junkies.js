const { getRank } = require("./util");
const fetch = require("isomorphic-fetch");

const junkies = async (req, res, User) => {
  const { token, captcha } = req.body;

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

  if (!robot.success || robot.score < 0.5) {
    res.json({ response: "Je bent helaas gepakt door de robot-detectie!" });
    return;
  }

  const timeNeeded = 120000;
  const timeKey = "junkiesAt";
  const valueKey = "junkies";
  const name = "junkies";
  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    const rang = getRank(user.rank, "number");

    if (user[timeKey] + timeNeeded < Date.now()) {
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

      const random = Math.ceil(
        Math.random() * 10 * rang * (accomplices.length + 1)
      );

      User.update(
        {
          [timeKey]: Date.now(),
          [valueKey]: user[valueKey] + random,
          gamepoints: user.gamepoints + 1,
        },
        { where: { loginToken: token } }
      );

      res.json({
        response: `Je hebt ${random} ${name} getraind`,
      });
    } else {
      res.json({
        response: `Je moet nog ${Math.round(
          (user[timeKey] + timeNeeded - Date.now()) / 1000
        )} seconden wachten voor je weer kunt.`,
      });
    }
    //create activity with all variables
  }
};

module.exports = { junkies };
