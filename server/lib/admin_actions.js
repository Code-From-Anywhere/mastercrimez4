const { publicUserFields, getTextFunction } = require("./util");

let getText = getTextFunction();

const actions = async (req, res, User, sequelize) => {
  const { token, userId } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!userId) {
    res.json({ response: getText("noId") });
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

  const user2 = await User.findOne({
    attributes: publicUserFields,
    where: { id: userId },
  });
  if (!user2) {
    return res.json({ response: getText("userNotFound") });
  }

  const query = `SELECT * FROM actions WHERE userId=${userId} AND timestamp > ${
    Date.now() - 86400000
  }`;

  const [actionsQuery] = await sequelize.query(query);

  const query2 = `SELECT * FROM movements WHERE userId=${userId} AND timestamp > ${
    Date.now() - 86400000
  }`;

  const [movementsQuery] = await sequelize.query(query2);

  res.json({ user: user2, actions: actionsQuery, movements: movementsQuery });
};

module.exports = { actions };
