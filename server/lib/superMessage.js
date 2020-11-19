const { Op } = require("sequelize");
const { sendMessageAndPush, getTextFunction } = require("./util");

let getText = getTextFunction();

const PRICE = 500;

const superMessage = async (req, res, User, Message) => {
  const { token, message } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.credits < PRICE) {
    res.json({ response: getText("notEnoughCredits") });
    return;
  }

  if (!message) {
    res.json({ response: getText("superMessageNo") });
    return;
  }

  const [updated] = await User.update(
    { credits: user.credits - PRICE },
    { where: { loginToken: token, credits: { [Op.gte]: PRICE } } }
  );
  if (!updated) {
    return res.json({ response: getText("notEnoughCredits") });
  }

  const to = await User.findAll({ where: { phoneVerified: true } });

  if (to) {
    to.forEach((user2) => {
      sendMessageAndPush(user, user2, message, Message);
    });
  }

  res.json({ response: getText("success") });
};

module.exports = { superMessage };
