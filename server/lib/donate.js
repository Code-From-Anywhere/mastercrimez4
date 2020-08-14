const { Op } = require("sequelize");
const { sendMessageAndPush } = require("./util");

const donate = async (req, res, User, Message) => {
  const { loginToken, to, amount, type } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  const validTypes = [
    "cash",
    "bullets",
    "hoeren",
    "junkies",
    "wiet",
    "gamepoints",
  ];

  const typeNames = {
    cash: "contant",
    bullets: "kogels",
    hoeren: "hoeren",
    junkies: "junkies",
    wiet: "wiet",
    gamepoints: "gamepoints",
  };

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: "Ongeldige hoeveelheid" });
    return;
  }

  if (!validTypes.includes(type)) {
    res.json({ response: "Ongeldig type" });
    return;
  }

  if (user) {
    if (user[type] >= amount) {
      const user2 = await User.findOne({ where: { name: to } });

      if (user2) {
        if (user2.id !== user.id) {
          if (user2.health > 0) {
            const amount2 = Math.round(amount * 0.95);

            const typeName = typeNames[type];

            const gelukt = await User.update(
              { [type]: user[type] - amount },
              { where: { id: user.id, [type]: { [Op.gte]: amount } } }
            );
            if (gelukt[0] === 1) {
              User.update(
                { [type]: user2[type] + amount2 },
                { where: { id: user2.id } }
              );
            }
            const message = `${user.name} heeft jou ${amount2} ${typeName} overgemaakt`;

            sendMessageAndPush(user, user2, message, Message, true);

            res.json({ response: "Overgemaakt." });
          } else {
            res.json({ response: "Deze speler is dood" });
          }
        } else {
          res.json({ response: "Je kan niet naar jezelf overmaken" });
        }
      } else {
        res.json({ response: "Deze speler bestaat niet" });
      }
    } else {
      res.json({ response: "Je hebt niet genoeg" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { donate };
