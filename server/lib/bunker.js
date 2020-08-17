const { needCaptcha } = require("./util");

const bunker = async (req, res, User) => {
  const { token, option, captcha } = req.body;

  if (option < 0 || option > 3 || isNaN(option)) {
    res.json({ response: "Ongeldige keuze" });
    return;
  }

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    if (user.needCaptcha && Number(captcha) !== user.captcha) {
      return res.json({ response: "Verkeerde code!" });
    }

    if (user.bunkerAt < Date.now()) {
      const seconds = option === 1 ? 60 : option === 2 ? 300 : 900;
      const cost = option === 1 ? 50000 : option === 2 ? 250000 : 1000000;

      if (user.cash >= cost) {
        User.update(
          {
            bunkerAt: Date.now() + seconds * 1000,
            cash: user.cash - cost,
            captcha: null,
            needCaptcha: needCaptcha(),
          },
          { where: { loginToken: token } }
        );

        res.json({
          response: `Je bent ondergedoken.`,
        });
      } else {
        res.json({ response: "Je hebt niet genoeg geld contant" });
      }
    } else {
      res.json({
        response: "Je zit al in de schuilkelder.",
      });
    }
  } else {
    res.json({ response: "Ongeldige user" });
  }
};

module.exports = { bunker };
