const { getRank } = require("./util");
const fetch = require("isomorphic-fetch");

const gym = async (req, res, User) => {
  const { token, option, captcha } = req.body;

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

  if (option < 1 || option > 3 || isNaN(option)) {
    res.json({ response: "Ongeldige keuze" });
    return;
  }
  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    if (user.gymAt + user.gymTime < Date.now()) {
      const random = Math.ceil(
        Math.random() * 10 * option * getRank(user.rank, "number")
      );

      User.update(
        {
          gymAt: Date.now(),
          gymTime: 120000 * option,
          strength: user.strength + random,
          gamepoints: user.gamepoints + 1,
        },
        { where: { loginToken: token } }
      );

      res.json({
        response: `Success! Het is je ${random} keer gelukt`,
      });
    } else {
      res.json({
        response: `Je moet nog ${Math.round(
          (user.gymAt + user.gymTime - Date.now()) / 1000
        )} seconden wachten voor je weer kunt.`,
      });
    }
    //create activity with all variables
  }
};

module.exports = { gym };
