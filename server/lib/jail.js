const { Op } = require("sequelize");
const { sendMessageAndPush } = require("./util");

const jail = async (req, res, User) => {
  const people = await User.findAll({
    attributes: ["name", "jailAt"],
    where: { jailAt: { [Op.gt]: Date.now() } },
  });

  res.json({ jail: people });
};

const breakout = async (req, res, User, Message) => {
  const { token, name } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken: token, phoneVerified: false },
  });
  if (isNotVerified) {
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
      { jailAt: Date.now() + seconds * 1000 },
      { where: { id: user.id } }
    );
  } else {
    res.json({
      response: `Je hebt ${user2.name} uitgebroken.`,
    });

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
