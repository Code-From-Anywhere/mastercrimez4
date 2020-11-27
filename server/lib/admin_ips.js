const { getTextFunction } = require("./util");

let getText = getTextFunction();

const ips = async (req, res, User, sequelize) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.level < 5) {
    res.json({ response: getText("noAccess") });
    return;
  }

  const query = `SELECT id,name,ip FROM users WHERE onlineAt > ${
    Date.now() - 86400000
  } AND phoneVerified=1 ORDER BY ip`;

  const [results] = await sequelize.query(query);

  res.json({ ips: results });
};

module.exports = { ips };
