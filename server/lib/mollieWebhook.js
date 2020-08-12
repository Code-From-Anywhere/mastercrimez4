const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY_TEST,
}); //remove _TEST for live api key

const mollieWebhook = async (req, res, User) => {
  const { id } = req.body;

  mollieClient.payments
    .get(id)
    .then((payment) => {
      console.log("payment", payment);
      // E.g. check if the payment.isPaid()
      if (payment.isPaid()) {
        //maak credits over naar user
        console.log("isPaid", payment.isPaid());
      }
    })
    .catch((error) => {
      console.log("err", error);
      // Handle the error
    });

  return res.json({ response: "Er ging iets mis" });
};

module.exports = { mollieWebhook };
