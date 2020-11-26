const { Sequelize, Op } = require("sequelize");
const { getRank, getTextFunction, sendChatPushMail } = require("./util");

let getText = getTextFunction();

const enterCode = async (
  req,
  res,
  { User, Code, Action, Channel, ChannelMessage, ChannelSub }
) => {
  const { loginToken, code } = req.body;

  if (!loginToken) {
    return res.json({ response: getText("noToken") });
  }
  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: getText("invalidUser") });
  }
  getText = getTextFunction(user.locale);

  if (!code) {
    return res.json({ response: getText("noCode") });
  }

  const codeObject = await Code.findOne({ where: { code } });

  if (!codeObject) {
    return res.json({ response: getText("noCode") });
  }

  if (codeObject.validUntil < Date.now()) {
    console.log("validUntil");
    return res.json({ response: getText("codeNoLongerValid") });
  }

  const user2 = await User.findOne({ where: { id: codeObject.userId } });

  if (!user2) {
    console.log("user2");
    return res.json({ response: getText("codeNoLongerValid") });
  }

  if (user2.id === user.id) {
    console.log("samseUser");
    return res.json({ response: getText("codeNoLongerValid") });
  }

  const destroyed = await Code.destroy({ where: { id: codeObject.id } });
  if (!destroyed) {
    console.log("!destroyed");
    return res.json({ response: getText("codeNoLongerValid") });
  }
  console.log("destroyed?", destroyed);
  //code is valid

  Action.create({
    userId: user.id,
    action: "enterCode",
    timestamp: Date.now(),
  });

  if (codeObject.carId) {
    //add carId to user

    //@TODO

    //send message to user2 that user has stolen the car

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getText("enterCodeCarMessage", user.name, car.name),
      user1: user,
      user2,
    });
    //response to user

    res.json({
      response: getText("enterCodeCarSuccess", car.name),
    });
  }

  if (codeObject.what && codeObject.amount) {
    const update = {
      [codeObject.what]: Sequelize.literal(
        `${codeObject.what}+${Math.round(codeObject.amount / 2)}`
      ),
    };
    //add amount/2 what to both user and user2
    User.update(update, { where: { id: user.id } });
    User.update(update, { where: { id: user2.id } });
    const whatString = getText(codeObject.what);

    //send message about it to user2
    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      isSystem: true,
      message: getText(
        "enterCodeWhatMessage",
        user.name,
        codeObject.amount,
        whatString
      ),
      user1: user,
      user2,
    });

    //response to user
    res.json({
      response: getText(
        "enterCodeWhatSuccess",
        user2.name,
        codeObject.amount,
        whatString
      ),
    });
  }
};

module.exports = { enterCode };
