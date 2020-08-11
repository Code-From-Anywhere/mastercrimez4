const fetch = require("isomorphic-fetch");

const income = async (req, res, User) => {
  const { token, captcha } = req.body;

  // const secret_key = process.env.GOOGLE_CAPTCHA_KEY;
  // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${captcha}`;

  // const robot = await fetch(url, {
  //   method: "post",
  // })
  //   .then((response) => response.json())
  //   .then((google_response) => {
  //     return google_response;
  //   })
  //   .catch((error) => res.json({ error }));

  // if (!robot.success || robot.score < 0.3) {
  //   res.json({ response: "Je bent helaas gepakt door de robot-detectie!" });
  //   return;
  // }

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }
  const incomeAt = user.incomeAt ? user.incomeAt : 0;
  const uren = Math.round((Date.now() - incomeAt) / 3600000);
  const uren2 = uren > 24 ? 24 : uren;
  const amount = Math.round(
    (user.junkies + user.hoeren + user.wiet) * 50 * Math.sqrt(uren2)
  );

  User.update(
    { incomeAt: Date.now(), cash: user.cash + amount },
    { where: { id: user.id } }
  );

  res.json({
    response: `Je hebt inkomen opgehaald: ${amount}.`,
  });
};

module.exports = { income };
