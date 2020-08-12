const { createMollieClient } = require("@mollie/api-client");

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
}); //remove _TEST for live api key

const mollieWebhook = async (req, res, User, Payment) => {
  const { id } = req.body;

  mollieClient.payments
    .get(id)
    .then(async (payment) => {
      //   console.log("payment", payment);
      // E.g. check if the payment.isPaid()
      if (payment.isPaid()) {
        //maak credits over naar user
        console.log("isPaid", payment.isPaid());
        const paymentLog = await Payment.findOne({
          where: { paymentId: id, status: null }, //nb : filter out status success, otherwhise you can do this more often
        });
        if (paymentLog) {
          const user = await User.findOne({ where: { id: paymentLog.userId } });

          const [updated] = await User.update(
            {
              credits: user.credits + paymentLog.credits,
              creditsTotal: user.creditsTotal + paymentLog.credits,
            },
            { where: { id: user.id } }
          );

          if (updated) {
            const [updatePaymentLog] = await Payment.update(
              { status: "success" },
              { where: { id: paymentLog.id } }
            );
            console.log(
              `Gelukt! ${user.name} heeft ${paymentLog.credits} ontvangen`
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
