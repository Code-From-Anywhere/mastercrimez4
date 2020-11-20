const { Sequelize, Op } = require("sequelize");
const { getRank, getTextFunction, sendChatPushMail } = require("./util");

let getText = getTextFunction();

const hospital = async (
  req,
  res,
  { User, Channel, ChannelMessage, ChannelSub, Action }
) => {
  const { loginToken, name } = req.body;
  const user = await User.findOne({ where: { loginToken } });

  if (user) {
    getText = getTextFunction(user.locale);

    const user2 = await User.findOne({ where: { name: name } });

    if (user2) {
      if (user2.health > 0) {
        if (user2.health === 100) {
          return res.json({ response: getText("hospitalStillAlive") });
        }

        const cost =
          (100 - user2.health) * getRank(user2.rank, "number") * 1000;

        if (user.cash < cost) {
          res.json({
            response: getText("notEnoughCash", cost),
          });
          return;
        }
        const [updated] = await User.update(
          { cash: Sequelize.literal(`cash-${cost}`), onlineAt: Date.now() },
          { where: { id: user.id, cash: { [Op.gte]: cost } } }
        );

        if (!updated) {
          return res.json({ response: getText("somethingWentWrong") });
        }
        User.update({ health: 100 }, { where: { id: user2.id } });

        const getUserText = getTextFunction(user2.locale);

        const message = getUserText("hospitalMessage", user.name);

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          isSystem: true,
          message,
          user1: user,
          user2,
        });

        Action.create({
          userId: user.id,
          action: "hospital",
          timestamp: Date.now(),
        });

        res.json({
          response: getText("hospitalSuccess", user2.name, cost),
        });
      } else {
        res.json({ response: getText("thisPlayerIsDead") });
      }
    } else {
      res.json({ response: getText("cantFindPlayer") });
    }
  } else {
    res.json({ response: getText("cantFindPlayer") });
  }
};

module.exports = { hospital };
