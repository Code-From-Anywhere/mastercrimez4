const { getRank, sendMessageAndPush } = require("./util");
const hospital = async (req, res, User, Message) => {
  const { loginToken, name } = req.body;
  const user = await User.findOne({ where: { loginToken } });

  if (user) {
    const user2 = await User.findOne({ where: { name: name } });

    if (user2) {
      if (user2.health > 0) {
        if (user2.health === 100) {
          return res.json({ response: "Deze speler is nog helemaal levend" });
        }

        const cost =
          (100 - user2.health) * getRank(user2.rank, "number") * 1000;

        if (user.cash < cost) {
          res.json({
            response: `Je hebt niet genoeg geld contant, het kost ${cost},-`,
          });
          return;
        }
        User.update({ cash: user.cash - cost }, { where: { id: user.id } });
        User.update({ health: 100 }, { where: { id: user2.id } });
        const message = `${user.name} heeft jou naar het ziekenhuis gebracht.`;
        sendMessageAndPush(user, user2, message, Message, true);

        res.json({
          response: `Je hebt ${user2.name} naar het ziekenhuis gebracht voor ${cost}`,
        });
      } else {
        res.json({ response: "Deze speler is dood" });
      }
    } else {
      res.json({ response: "Deze speler bestaat niet" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { hospital };
