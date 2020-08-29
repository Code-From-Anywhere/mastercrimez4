const movementsApp = async (req, res, User, Movement) => {
  const { loginToken, movements } = req.body;

  if (!loginToken) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  const bulkMovements = movements.map((m) => {
    var m2 = m;
    m2.userId = user.id;
    return m2;
  });

  Movement.bulkCreate(bulkMovements);

  res.json({ response: "Gelukt" });
};

module.exports = { movementsApp };
