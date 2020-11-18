const items = require("../assets/shop.json");
const { Op } = require("sequelize");
const { needCaptcha, getTextFunction } = require("./util");

let getText = getTextFunction();

const buyBullets = async (req, res, sequelize, User, City, Action) => {
  let { loginToken, amount, captcha } = req.body;

  amount = Math.round(Number(amount));

  if (isNaN(amount) || amount <= 0) {
    return res.json({ response: getText("invalidAmount") });
  }
  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }

  getText = getTextFunction(user.locale);

  if (user.jailAt > Date.now()) {
    return res.json({ response: getText("youreInJail") });
  }

  if (user.health === 0) {
    return res.json({ response: getText("youreDead") });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: getText("youreTraveling") });
  }

  if (user.needCaptcha && Number(captcha) !== user.captcha) {
    return res.json({ response: getText("wrongCode") });
  }

  const city = await City.findOne({ where: { city: user.city } });

  if (!city) {
    return res.json({ response: getText("cityNotFound") });
  }

  const price = city.bulletFactoryPrice * amount;

  if (price > user.cash) {
    res.json({ response: getText("notEnoughCash", price) });
    return;
  }

  if (amount > city.bullets) {
    return res.json({ response: getText("notEoughBullets") });
  }

  const [cityUpdated] = await City.update(
    { bullets: city.bullets - amount },
    { where: { city: user.city, bullets: { [Op.gte]: amount } } }
  );

  if (!cityUpdated) {
    return res.json({ response: getText("notEnoughBullets") });
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
    return res.json({ response: getText("somethingWentWrong") });
  }

  Action.create({
    userId: user.id,
    action: "buyBullets",
    timestamp: Date.now(),
  });

  const profit = Math.round(price / 2);
  sequelize.query(
    `UPDATE cities SET bulletFactoryProfit=bulletFactoryProfit+${profit} WHERE city='${user.city}'`
  );
  //
  res.json({ response: getText("buyBulletsSuccess") });
};

module.exports = { buyBullets };
