const emails = require("../assets/emails.json");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const EMAIL_FROM = "info@mastercrimez.nl";

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const email = async (req, res, User) => {
  const { token, message, subject } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (user.level < 10) {
    res.json({ response: "Geen toegang" });
    return;
  }

  if (!message || !subject) {
    res.json({ response: "Vul een onderwerp en bericht in" });
    return;
  }

  const realEmails = emails.filter((item) => isEmail(item.email));

  //   emails.forEach((item, index) => {
  //     if (item.email === "wijnandworld@hotmail.com") {
  //       const msg = {
  //         to: item.email,
  //         from: EMAIL_FROM,
  //         subject: subject.replace(/\[name\]/g, item.login),
  //         text: message.replace(/\[name\]/g, item.login),
  //       };

  //       //ES6
  //       sgMail.send(msg).then(() => {}, console.error);
  //     }
  //   });

  res.json({ response: "Gelukt" });
};

module.exports = { email };
