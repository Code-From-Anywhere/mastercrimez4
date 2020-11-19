const { getTextFunction } = require("./util");

let getText = getTextFunction();

const movementsApp = async (req, res, User, Movement) => {
  const { loginToken, movements } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const bulkMovements = movements.map((m) => {
    var m2 = m;
    m2.userId = user.id;
    return m2;
  });

  Movement.bulkCreate(bulkMovements);

  res.json({ response: getText("success") });
};

module.exports = { movementsApp };
