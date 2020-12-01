const { getTextFunction, publicUserFields } = require("./util");
const { Op } = require("sequelize");

let getText = getTextFunction();

const report = async (req, res, { User }) => {
  let { token, ban, userId, banReason } = req.body;

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

  const user2 = await User.findOne({ where: { id: userId } });

  if (!user2) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  const banTypes = ["none", "reported", "banned", "shadowBanned"];

  ban = banTypes.includes(ban) ? ban : "reported";
  ban = user.level >= 5 ? ban : "reported";

  if (user.ban === "none" || user.level >= 5) {
    User.update({ ban, banReason }, { where: { id: user2.id } });
  }

  res.json({ response: getText("success") });
};

const reports = async (req, res, { User }) => {
  let { token } = req.query;

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
    return res.json({ response: getText("noAccess") });
  }

  const fields = publicUserFields;
  fields.push("ban");
  fields.push("banReason");

  const users = await User.findAll({
    attributes: fields,
    where: { ban: { [Op.ne]: "none" } },
  });

  return res.json({ reports: users });
};

module.exports = { report, reports };
