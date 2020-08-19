const { getRank, needCaptcha, NUM_ACTIONS_UNTIL_VERIFY } = require("./util");
const fetch = require("isomorphic-fetch");
const { Sequelize, Op } = require("sequelize");
const gym = async (req, res, User) => {
  const { token, option, captcha } = req.body;

  if (option < 1 || option > 3 || isNaN(option)) {
    res.json({ response: "Ongeldige keuze" });
    return;
  }
  if (!token) {
    res.json({ response: "Geen token" });
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

    if (user.jailAt > Date.now()) {
      return res.json({ response: "Je zit in de bajes." });
    }

    if (user.health === 0) {
      return res.json({ response: "Je bent dood." });
    }

    if (user.reizenAt > Date.now()) {
      return res.json({ response: "Je bent aan het reizen." });
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
            gymAt: { [Op.lt]: Date.now() - 120000 * option },
          },
        }
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
