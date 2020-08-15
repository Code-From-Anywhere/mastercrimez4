const { Op } = require("sequelize");
const { sendMessageAndPush } = require("./util");

const newTopic = async (req, res, User, ForumTopic) => {
  const { token, title, message } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  if (!title || !message) {
    res.json({ response: "Vul een onderwerp en bericht in" });
    return;
  }

  ForumTopic.create({
    name: user.name,
    title,
    message,
  });

  res.json({ response: "Topic aangemaakt", success: true });
};

const topics = async (req, res, User, ForumTopic, ForumResponse) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const allTopics = await ForumTopic.findAll({
    limit: 100,
    order: [["updatedAt", "desc"]],
  });

  res.json({ response: "Success", topics: allTopics });
};

const getTopic = async (req, res, User, ForumTopic, ForumResponse) => {
  const { token, id } = req.query;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const topic = await ForumTopic.findOne({ where: { id } });

  if (!topic) {
    res.json({ response: "topic niet gevonden" });
    return;
  }

  const responses = await ForumResponse.findAll({
    where: { topicId: id },
    order: [["createdAt", "desc"]],
  });
  res.json({ response: "Success", topic, responses });
};

const response = async (req, res, User, ForumTopic, ForumResponse, Message) => {
  const { token, id, response } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Geen user" });
    return;
  }

  const topic = await ForumTopic.findOne({ where: { id } });

  if (!topic) {
    res.json({ response: "topic niet gevonden" });
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
    sendMessageAndPush(
      user,
      creator,
      "Er is een bericht geplaatst in een topic van je",
      Message,
      true
    );
  }

  res.json({ response: "Success" });
};

module.exports = { newTopic, topics, getTopic, response };
