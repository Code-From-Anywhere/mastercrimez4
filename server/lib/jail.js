const { Op, Sequelize } = require("sequelize");
const {
  sendMessageAndPush,
  needCaptcha,
  NUM_ACTIONS_UNTIL_VERIFY,
} = require("./util");

const jail = async (req, res, User) => {
  const people = await User.findAll({
    attributes: ["name", "jailAt"],
    where: { jailAt: { [Op.gt]: Date.now() } },
  });

  res.json({ jail: people });
};

const breakout = async (req, res, User, Message) => {
  const { token, name, captcha } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
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

  // if (user.needCaptcha && Number(captcha) !== user.captcha) {
  //   return res.json({ response: "Verkeerde code!" });
  // }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified && isNotVerified.numActions > NUM_ACTIONS_UNTIL_VERIFY) {
    return res.json({ response: "Je moet je account eerst verifiëren!" });
  }

  const user2 = await User.findOne({ where: { name } });

  if (!user2) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (user2.jailAt < Date.now()) {
    res.json({ response: `${user2.name} zit niet in de gevangenis.` });
    return;
  }

  if (user.jailAt > Date.now()) {
    res.json({ response: `Je zit in de gevangenis.` });
    return;
  }

  const random = Math.round(Math.random() * 100);

  if (random < 50) {
    const seconds = 45;

    res.json({
      response: `Het is mislukt. Je zit nu zelf in de gevangenis voor ${seconds} seconden.`,
    });

    User.update(
      {
        // captcha: null,
        // needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
        jailAt: Date.now() + seconds * 1000,
      },
      { where: { id: user.id } }
    );
  } else {
    res.json({
      response: `Je hebt ${user2.name} uitgebroken.`,
    });

    User.update(
      {
        // captcha: null,
        // needCaptcha: needCaptcha(),
        numActions: Sequelize.literal(`numActions+1`),
        rank: Sequelize.literal(`rank + 10`),
      },
      { where: { id: user.id } }
    );
    sendMessageAndPush(
      user,
      user2,
      `${user.name} heeft jou uitgebroken`,
      Message,
      true
    );

    User.update({ jailAt: null }, { where: { id: user2.id } });
  }
};

module.exports = { jail, breakout };
