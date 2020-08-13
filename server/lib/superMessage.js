const { Op } = require("sequelize");
const { sendMessageAndPush } = require("./util");

const PRICE = 500;

const superMessage = async (req, res, User, Message) => {
  const { token, message } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (user.credits < PRICE) {
    res.json({ response: "Je hebt niet genoeg credits" });
    return;
  }

  if (!message) {
    res.json({ response: "Vul een bericht in" });
    return;
  }

  const [updated] = await User.update(
    { credits: user.credits - PRICE },
    { where: { loginToken: token, credits: { [Op.gte]: PRICE } } }
  );
  if (!updated) {
    return res.json({ response: "Je hebt niet genoeg credits" });
  }

  const to = await User.findAll({ where: { phoneVerified: true } });

  if (to) {
    to.forEach((user2) => {
      sendMessageAndPush(user, user2, message, Message);
    });
  }

  res.json({ response: "Gelukt" });
};

module.exports = { superMessage };
