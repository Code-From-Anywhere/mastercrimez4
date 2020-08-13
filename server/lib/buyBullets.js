const items = require("../assets/shop.json");
const { Op } = require("sequelize");

const buyBullets = async (req, res, User, City) => {
  let { loginToken, amount } = req.body;

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

  const city = await City.findOne({ where: { city: user.city } });

  if (!city) {
    return res.json({ response: "Stad niet gevonden" });
  }

  const price = city.bulletPrice * amount;

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
      bullets: user.bullets + amount,
      cash: user.cash - price,
    },
    { where: { id: user.id, cash: { [Op.gte]: price } } }
  );

  if (!updated) {
    return res.json({ response: "Er ging iets fout" });
  }

  res.json({ response: "Gekocht" });
};

module.exports = { buyBullets };
