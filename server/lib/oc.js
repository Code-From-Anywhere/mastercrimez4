const { getRank, getStrength } = require("./util");
const { Sequelize, Op } = require("sequelize");
const fetch = require("isomorphic-fetch");

const SECONDS = 120;

const oc = async (req, res, User, Message) => {
  const { token, captcha } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified) {
    return res.json({ response: "Je moet je account eerst verifiëren!" });
  }

  // const secret_key = process.env.GOOGLE_CAPTCHA_KEY;
  // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captcha}`;

  // const robot = await fetch(url, {
  //   method: "post",
  // })
  //   .then((response) => response.json())
  //   .then((google_response) => {
  //     return google_response;
  //   })
  //   .catch((error) => res.json({ error }));

  // if (!robot.success || robot.score < 0.3) {
  //   res.json({ response: "Je bent helaas gepakt door de robot-detectie!" });
  //   return;
  // }

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
        response:
          "Jij hebt nog geen handlangers. Nodig vrienden uit om georganiseerde misdaden met ze te kunnen doen.",
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

    User.update(
      {
        [timeKey]: Date.now(),
      },
      { where: { loginToken: token } }
    );

    if (accomplices.length === 0) {
      const names = accomplicesTotal.map((acc) => acc.name).join(", ");

      return res.json({
        response: `Je bent een OC gestart. Je handlangers hebben 2 minuten om deel te nemen. Vraag ${names} om te spelen!`,
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
      response: `Je hebt een OC gedaan met ${names}. De OC is gelukt! Je hebt ${random} ${name} verdiend. De komende 2 minuten zal jij je handlangers helpen met alle andere misdaden!`,
    });
  } else {
    res.json({
      response: `Je moet nog ${Math.round(
        (user[timeKey] + timeNeeded - Date.now()) / 1000
      )} seconden wachten voor je weer kunt.`,
    });
  }
  //create activity with all variables
};

module.exports = { oc };
