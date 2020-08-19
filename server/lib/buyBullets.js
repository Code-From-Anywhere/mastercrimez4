const items = require("../assets/shop.json");
const { Op } = require("sequelize");
const { needCaptcha } = require("./util");

const buyBullets = async (req, res, sequelize, User, City) => {
  let { loginToken, amount, captcha } = req.body;

  amount = Math.round(Number(amount));

  if (isNaN(amount) || amount <= 0) {
    return res.json({ response: "Dat is geen geldig aantal" });
  }
  if (!loginToken) {
    return res.json({ response: "Geen logintoken gegeven" });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: "Verkeerde code!" });
  }

  const city = await City.findOne({ where: { city: user.city } });

  if (!city) {
    return res.json({ response: "Stad niet gevonden" });
  }

  const price = city.bulletFactoryPrice * amount;

  if (price > user.cash) {
    res.json({ response: "Je hebt niet genoeg geld contant" });
    return;
  }

  if (amount > city.bullets) {
    return res.json({ response: "Er zijn niet genoeg kogels" });
  }

  const [cityUpdated] = await City.update(
    { bullets: city.bullets - amount },
    { where: { city: user.city, bullets: { [Op.gte]: amount } } }
  );

  if (!cityUpdated) {
    return res.json({ response: "Er zijn niet genoeg kogels" });
  }

  const [updated] = await User.update(
    {
      captcha: null,
      needCaptcha: needCaptcha(),
      bullets: user.bullets + amount,
      cash: user.cash - price,
      onlineAt: Date.now(),
    },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (!updated) {
    return res.json({ response: "Er ging iets fout" });
  }

  const profit = Math.round(price / 2);
  sequelize.query(
    `UPDATE cities SET bulletFactoryProfit=bulletFactoryProfit+${profit} WHERE city='${user.city}'`
  );
  //
  res.json({ response: "Gekocht" });
};

module.exports = { buyBullets };
