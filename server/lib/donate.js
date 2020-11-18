const { Op } = require("sequelize");
const { sendMessageAndPush, getTextFunction } = require("./util");
const { Sequelize } = require("sequelize");

let getText = getTextFunction();

const donate = async (req, res, User, Message, Action) => {
  const { loginToken, to, amount, type } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  const validTypes = [
    "cash",
    "bank",
    "bullets",
    "hoeren",
    "junkies",
    "wiet",
    "gamepoints",
  ];

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: getText("invalidAmount") });
    return;
  }

  if (!validTypes.includes(type)) {
    res.json({ response: getText("invalidType") });
    return;
  }

  const isNotVerified = await User.findOne({
    where: { loginToken, phoneVerified: false },
  });
  if (isNotVerified) {
    //NB: Verify instantly here because you can otherwise send stuff to your main
    return res.json({ response: getText("accountNotVerified") });
  }

  if (user) {
    getText = getTextFunction(user.locale);
    const typeNames = {
      cash: getText("cash"),
      bank: getText("bankMoney"),
      bullets: getText("bullets"),
      hoeren: getText("hoeren"),
      junkies: getText("junkiesCurrency"),
      wiet: getText("wiet"),
      gamepoints: getText("gamepoints"),
    };

    if (user.jailAt > Date.now()) {
      return res.json({ response: getText("youreInJail") });
    }

    if (user.health === 0) {
      return res.json({ response: getText("youreDead") });
    }

    if (user.reizenAt > Date.now()) {
      return res.json({ response: getText("youreTraveling") });
    }

    if (user[type] >= amount) {
      const user2 = await User.findOne({ where: { name: to } });

      if (user2) {
        if (user2.id !== user.id) {
          if (user2.health > 0) {
            const amount2 = Math.round(amount * 0.95);

            const typeName = typeNames[type];

            const gelukt = await User.update(
              {
                [type]: user[type] - amount,
                numActions: Sequelize.literal(`numActions+1`),
                onlineAt: Date.now(),
              },
              { where: { id: user.id, [type]: { [Op.gte]: amount } } }
            );
            if (gelukt[0] === 1) {
              User.update(
                { [type]: user2[type] + amount2 },
                { where: { id: user2.id } }
              );
            }
            const message = getText(
              "donateMessage",
              user.name,
              amount2,
              typeName
            );

            Action.create({
              userId: user.id,
              action: "donate",
              timestamp: Date.now(),
            });

            sendMessageAndPush(user, user2, message, Message, true);

            res.json({ response: getText("donateSuccess") });
          } else {
            res.json({ response: getText("thisPlayerIsDead") });
          }
        } else {
          res.json({ response: getText("cantDonateToYourself") });
        }
      } else {
        res.json({ response: getText("playerDoesntExist") });
      }
    } else {
      res.json({ response: getText("notEnough") });
    }
  } else {
    res.json({ response: getText("cantFindPlayer") });
  }
};

module.exports = { donate };
