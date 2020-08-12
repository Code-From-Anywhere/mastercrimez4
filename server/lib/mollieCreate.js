const { Sequelize, Op } = require("sequelize");
const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY_TEST,
}); //remove _TEST for live api key

const items = [
  {
    eur: "10.00",
    credits: 1000,
  },
  {
    eur: "50.00",
    credits: 5000,
  },
];
const mollieCreate = async (req, res, User, Payment) => {
  const { token, item } = req.body;

  const yourItem = items[item];

  if (!yourItem) {
    return res.json({ response: "Ongeldig item" });
  }
  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldig token" });
    return;
  }

  const uniqueId = Math.round(Math.random() * 999999);

  return mollieClient.payments
    .create({
      amount: {
        value: yourItem.eur,
        currency: "EUR",
      },
      description: `${yourItem.credits} credits`,
      redirectUrl: `https://mastercrimez.nl/#/mollieComplete`,
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
      res.json({ response: "Er ging iets mis" });
    });
};

module.exports = { mollieCreate };
