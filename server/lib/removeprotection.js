const removeprotection = async (req, res, User, Garage) => {
  const { token } = req.body;

  if (!token) {
    console.log("token", req);
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Invalid token" });
    return;
  }

  User.update({ protectionAt: null }, { where: { id: user.id } });
  res.json({ response: "Wegggehaald" });
};

module.exports = { removeprotection };
