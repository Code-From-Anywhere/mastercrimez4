const { getTextFunction } = require("./util");

let getText = getTextFunction();

const removeprotection = async (req, res, User, Garage) => {
  const { token } = req.body;

  if (!token) {
    console.log("token", req);
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  User.update({ protectionAt: null }, { where: { id: user.id } });
  res.json({ response: getText("removeProtectionSuccess") });
};

module.exports = { removeprotection };
