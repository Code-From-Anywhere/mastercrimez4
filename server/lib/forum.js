const { Op } = require("sequelize");
const { getTextFunction, sendChatPushMail } = require("./util");
let getText = getTextFunction();

const newTopic = async (req, res, User, ForumTopic) => {
  const { token, title, message } = req.body;

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

  if (!title || !message) {
    res.json({ response: getText("noTitleAndMessage") });
    return;
  }

  User.update({ onlineAt: Date.now() }, { where: { id: user.id } });

  ForumTopic.create({
    name: user.name,
    title,
    message,
  });

  res.json({ response: getText("newTopicSuccess"), success: true });
};

const topics = async (req, res, User, ForumTopic, ForumResponse) => {
  const { token } = req.query;

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

  const allTopics = await ForumTopic.findAll({
    limit: 100,
    order: [["updatedAt", "desc"]],
  });

  res.json({ response: getText("success"), topics: allTopics });
};

const getTopic = async (req, res, User, ForumTopic, ForumResponse) => {
  const { token, id } = req.query;

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
  const topic = await ForumTopic.findOne({ where: { id } });

  if (!topic) {
    res.json({ response: getText("topicNotFound") });
    return;
  }

  const responses = await ForumResponse.findAll({
    where: { topicId: id },
    order: [["createdAt", "desc"]],
  });
  res.json({ response: getText("success"), topic, responses });
};

const response = async (
  req,
  res,
  { ForumTopic, ForumResponse, Channel, ChannelMessage, ChannelSub, User }
) => {
  const { token, id, response } = req.body;

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

  User.update({ onlineAt: Date.now() }, { where: { id: user.id } });
  const topic = await ForumTopic.findOne({ where: { id } });

  if (!topic) {
    res.json({ response: getText("topicNotFound") });
    return;
  }

  const creator = await User.findOne({ where: { name: topic.name } });

  ForumTopic.update({ responses: topic.responses + 1 }, { where: { id } });
  const responseCreate = await ForumResponse.create({
    name: user.name,
    topicId: id,
    message: response,
  });
  if (creator) {
    const getUserText = getTextFunction(creator.locale);

    sendChatPushMail({
      Channel,
      ChannelMessage,
      ChannelSub,
      User,
      user1: user,
      user2: creator,
      isSystem: true,
      message: getUserText("forumMessage"),
    });
  }

  res.json({ response: getText("success") });
};

module.exports = { newTopic, topics, getTopic, response };
