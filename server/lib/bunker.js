const { needCaptcha, getTextFunction } = require("./util");

let getText = getTextFunction();

const bunker = async (req, res, User, Action) => {
  const { token, option, captcha } = req.body;

  if (option < 0 || option > 3 || isNaN(option)) {
    res.json({ response: getText("invalidChoice") });
    return;
  }

  if (!token) {
    res.json({ response: getText("noToken") });
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
            onlineAt: Date.now(),
          },
          { where: { loginToken: token } }
        );

        Action.create({
          userId: user.id,
          action: "bunker",
          timestamp: Date.now(),
        });

        res.json({
          response: getText("bunkerSuccess"),
        });
      } else {
        res.json({ response: getText("notEnoughCash", cost) });
      }
    } else {
      res.json({
        response: getText("bunkerAlready"),
      });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { bunker };
