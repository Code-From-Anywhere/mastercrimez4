const ips = async (req, res, User, sequelize) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (user.level < 2) {
    res.json({ response: "Geen toegang" });
    return;
  }

  const query = `SELECT id,name,ip FROM users WHERE onlineAt > ${
    Date.now() - 86400000
  } AND phoneVerified=1 ORDER BY ip`;

  const [results] = await sequelize.query(query);

  res.json({ ips: results });
};

module.exports = { ips };
