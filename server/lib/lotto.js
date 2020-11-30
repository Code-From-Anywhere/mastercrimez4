const { Op, Sequelize } = require("sequelize");
const { getTextFunction, sendChatPushMail } = require("./util");
const moment = require("moment");

let getText = getTextFunction();

const PRICE = 100000;

const lottoReleaseDate = moment("01/07/2021", "DD/MM/YYYY").set("hour", 17);

const buy = async (req, res, { User, City }) => {
  let { token, amount, type } = req.body;

  const types = ["lottoDay", "lottoWeek", "lottoMonth"];

  amount = Math.round(Number(amount));

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (amount < 1 || isNaN(amount)) {
    return res.json({ response: getText("invalidValues") });
  }
  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (moment().local().isBefore(lottoReleaseDate) && user.level < 2) {
    return res.json({ response: getText("noAccess") });
  }
  const cost = PRICE * amount;
  const profit = Math.round(PRICE * 0.1 * amount);
  if (user.cash < cost) {
    res.json({ response: getText("notEnoughCash", cost) });
    return;
  }

  if (!types.includes(type)) {
    return res.json({ response: getText("invalidValues") });
  }

  const [updated] = await User.update(
    { cash: user.cash - cost },
    { where: { loginToken: token, cash: { [Op.gte]: cost } } }
  );
  if (!updated) {
    return res.json({ response: getText("notEnoughCash", cost) });
  }

  //updat city casinoOwner with profit

  City.update(
    { casinoProfit: Sequelize.literal(`casinoProfit+${profit}`) },
    { where: { city: user.city } }
  );
  User.update(
    { [type]: Sequelize.literal(`${type}+${amount}`) },
    { where: { id: user.id } }
  );

  res.json({ response: getText("success") });
};

module.exports = { buy };
