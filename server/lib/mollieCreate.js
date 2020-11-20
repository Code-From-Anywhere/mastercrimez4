const { Sequelize, Op } = require("sequelize");
const { createMollieClient } = require("@mollie/api-client");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
}); //remove _TEST for live api key

const items = [
  {
    eur: "10.00",
    credits: 1000,
  },
  {
    eur: "50.00",
    credits: 6000,
  },
  {
    eur: "250.00",
    credits: 40000,
  },
];
const mollieCreate = async (req, res, User, Payment) => {
  const { token, item } = req.body;

  const yourItem = items[item];

  if (!yourItem) {
    return res.json({ response: getText("invalidItem") });
  }
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

  const uniqueId = Math.round(Math.random() * 999999);

  return mollieClient.payments
    .create({
      amount: {
        value: yourItem.eur,
        currency: "EUR",
      },
      description: `${yourItem.credits} credits`,
      redirectUrl: `https://mastercrimez.com/#/mollieComplete`,
      webhookUrl: `https://mcz.leckrapi.xyz/mollieWebhook`,
    })
    .then((payment) => {
      Payment.create({
        paymentId: payment.id,
        userId: user.id,
        credits: yourItem.credits,
      });

      res.json({ url: payment.getCheckoutUrl() });
    })
    .catch((error) => {
      // Handle the error
      console.log("ERROR ", error);
      res.json({ response: getText("somethingWentWrong") });
    });
};

module.exports = { mollieCreate };
