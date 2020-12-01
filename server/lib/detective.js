const {
  saveImageIfValid,
  publicUserFields,
  getTextFunction,
  sendChatPushMail,
} = require("./util");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");
let getText = getTextFunction();

const releaseDate = moment("01/06/2021", "DD/MM/YYYY").set("hours", 17);

const hireDetective = async (
  req,
  res,
  { User, Detective, Channel, ChannelMessage, ChannelSub }
) => {
  let { loginToken, name, type } = req.body;
  const types = ["slow", "normal", "fast"];
  type = types.includes(type) ? type : "slow";

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!name) {
    res.json({ response: getText("invalidValues") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (moment().isBefore(releaseDate) && user.level < 2) {
    return res.json({ response: getText("noAccess") });
  }

  const user2 = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", name)
      ),
    },
  });

  if (!user2 || name.toLowerCase() === user.name.toLowerCase()) {
    return res.json({ response: getText("personDoesntExist") });
  }

  const already = await Detective.findOne({
    where: { creatorId: user.id, userId: user2.id, city: null },
  });

  if (already) {
    return res.json({ response: getText("alradyHiredDetective") });
  }

  const cost =
    type === "slow" ? 100000 : type === "normal" ? 1000000 : 10000000;
  if (user.cash < cost) {
    return res.json({ response: getText("notEnoughCash", cost) });
  }

  const [updated] = await User.update(
    { cash: Sequelize.literal(`cash-${cost}`) },
    { where: { id: user.id, cash: { [Op.gte]: cost } } }
  );

  if (!updated) {
    return res.json({ response: getText("notEnoughCash", cost) });
  }

  const hours = type === "slow" ? 8 : type === "normal" ? 4 : 2;

  Detective.create({
    creatorId: user.id,
    userId: user2.id,
    findAfterSeconds: Math.round(Math.random() * 3600 * hours),
    seconds: 3600 * hours,
    city: null,
  });

  const getUserText = getTextFunction(user2.locale);
  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    user2,
    message: getUserText("detectiveHiredForYou"),
  });

  res.json({
    response: getText("hireDetectiveSuccess"),
    success: true,
  });
};

const finishDetectivesCron = async ({ User, Detective }) => {
  const finished = await Detective.findAll({
    where: {
      city: null,
    },
  });

  console.log("detecitves not completed", finished.length);
  finished.map(async (detective) => {
    if (
      moment(detective.createdAt).isBefore(
        moment().subtract(detective.findAfterSeconds, "seconds")
      )
    ) {
      console.log("detective finished");

      const user = await User.findOne({ where: { id: detective.userId } });
      const creator = await User.findOne({
        where: { id: detective.creatorId },
      });
      if (user && creator) {
        Detective.update({ city: user.city }, { where: { id: detective.id } });

        const getCreatorText = getTextFunction(me.locale);
        const getUserText = getTextFunction(user.locale);

        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          isSystem: true,
          user2: user,
          message: getUserText("detectiveYouAreFound"),
        });
        sendChatPushMail({
          Channel,
          ChannelMessage,
          ChannelSub,
          User,
          isSystem: true,
          user2: creator,
          message: getCreatorText("detectiveUserFound", user.name, user.city),
        });
      }
    }
  });
};
const detectives = async (req, res, { User, Detective }) => {
  const { loginToken } = req.query;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const detectives2 = await Detective.findAll({
    where: { creatorId: user.id },
    attributes: ["id", "createdAt", "city", "userId", "seconds"],
    include: { model: User, attributes: publicUserFields },
  });

  res.json({
    detectives: detectives2,
  });
};

const deleteOldDetectives = ({ sequelize }) => {
  sequelize.query(
    `DELETE FROM detectives WHERE UNIX_TIMESTAMP(createdAt) < UNIX_TIMESTAMP(NOW())-86400`
  );
};

module.exports = {
  hireDetective,
  detectives,
  finishDetectivesCron,
  deleteOldDetectives,
};
