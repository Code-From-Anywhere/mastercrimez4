const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY_TEST,
}); //remove _TEST for live api key

const mollieWebhook = async (req, res, User, Payment) => {
  const { id } = req.body;

  mollieClient.payments
    .get(id)
    .then(async (payment) => {
      console.log("payment", payment);
      // E.g. check if the payment.isPaid()
      if (payment.isPaid()) {
        //maak credits over naar user
        console.log("isPaid", payment.isPaid());
        const payment = await Payment.findOne({ paymentId: id });
        if (payment) {
          const user = await User.findOne({ where: { id: payment.userId } });

          const [updated] = await User.update(
            {
              credits: user.credits + payment.credits,
              creditsTotal: user.creditsTotal + payment.credits,
            },
            { where: { id: user.id } }
          );

          if (updated) {
            console.log(
              `Gelukt! ${user.name} heeft ${payment.credits} ontvangen`
            );
          }
        }
      }
    })
    .catch((error) => {
      console.log("err", error);
      // Handle the error
    });

  return res.json({ response: "Er ging iets mis" });
};

module.exports = { mollieWebhook };
