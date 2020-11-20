const { getTextFunction } = require("./util");
let getText = getTextFunction();

const GANG_CREATE_COST = 5000000;
const gangCreate = async (req, res, { Gang, User, Action }) => {
  const { token, name } = req.body;

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

  if (user.cash < GANG_CREATE_COST) {
    return res.json({ response: getText("notEnoughCash", GANG_CREATE_COST) });
  }
  // shit
  Gang.create({});

  res.json({ response: getText("gangCreateSuccess") });
};

module.exports = {
  gangCreate,
  gangInvitePlayer,
  gangJoin,
  gangAnswerJoin,
  gangLeave,
  gangRemove,
  gangTransaction,
  gangAnswerInvite,
  gangShop,
  gangUpdate,
  gangs,
  gang,
  gangSetRank,
  gangOc,
  gangAchievements,
};
