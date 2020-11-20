const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const EMAIL_FROM = "noreply@mastercrimez.com";
const { Sequelize, Op } = require("sequelize");

const needCaptcha = () => Math.round(Math.random() * 50) === 1;

const replaceAll = (string, search, replacement) =>
  string.split(search).join(replacement);

const getLocale = (userLocale) => {
  const firstPart = userLocale && userLocale.split("-")[0].split("_")[0];

  return firstPart === "nl" ? "nl" : "en";
};
const getTextFunction = (userLocale) => (key, ...args) => {
  const firstPart = userLocale && userLocale.split("-")[0].split("_")[0];

  //default
  let languageObject = require("../locale/en.json"); //change default to 'en' later

  if (firstPart === "nl") {
    languageObject = require("../locale/nl.json");
  }

  let string =
    languageObject[key] ||
    `Couldn't find key '${key}' for locale '${firstPart}'`;

  args.forEach((arg, index) => {
    string = replaceAll(string, `$${index + 1}`, arg);
  });

  return string;
};

const NUM_ACTIONS_UNTIL_VERIFY = 20;

const publicUserFields = [
  "id",
  "name",
  "image",
  "bio",
  "accomplice",
  "accomplice2",
  "accomplice3",
  "accomplice4",
  "cash",
  "bank",
  "rank",
  "health",
  "wiet",
  "junkies",
  "hoeren",
  "strength",
  "gamepoints",
  "level",
  "onlineAt",
  "creditsTotal",
];

const sendMessageAndPush = async (
  user,
  user2,
  message,
  Message,
  fromSystem
) => {
  const created = await Message.create({
    from: user.id,
    fromName: fromSystem ? "(System)" : user.name,
    to: user2.id,
    message,
    read: false,
  });

  if (user2.pushtoken) {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: user2.pushtoken,
        title: `Nieuw bericht van ${user.name}`,
        sound: "default",
        body: message,
        data: { id: created.id },
      }),
    })
      .then((result) => console.log("result", result.status))
      .catch((e) => console.log("err", e));
  }
};

const sendChatPushMail = async ({
  channelId, // if cid is set, use that
  gang, // if gang is set, use that
  user2, // otherwise send to channel [user1][user2]
  user1, // if not set, use regular systemchannel

  message,
  pathImage,
  isSystem,

  User,
  Channel,
  ChannelSub,
  ChannelMessage,
}) => {
  let channel;
  let title;
  if (gang) {
    channel = await Channel.findOne({ where: { gang: gang.name } });
    if (!channel) {
      channel = await Channel.create({ gang: gang.name });
      //add all gang users as channel subs
      const members = await User.findAll({ gang: gang.name });
      members.forEach((member) => {
        ChannelSub.create({ channelId: channel.id, userId: member.id });
      });
    }
    title = gang.name;
  } else if (user1 && user2) {
    const lowest = user1.id < user2.id ? user1.id : user2.id;
    const highest = user1.id > user2.id ? user1.id : user2.id;
    const pmUsersField = `[${lowest}][${highest}]`;

    channel = await Channel.findOne({ where: { pmUsers: pmUsersField } });
    if (!channel) {
      channel = await Channel.create({ pmUsers: pmUsersField });
      ChannelSub.create({ channelId: channel.id, userId: user1.id });
      ChannelSub.create({ channelId: channel.id, userId: user2.id });
    }
    title = user1.name;
  } else if (channelId) {
    channel = await Channel.findOne({ where: { id: channelId } });
    title = channel.pmUsers ? user1.name : channel.name; //channel name of gang should be the same as the gang name
  } else {
    //user1 probably undefined. therefore, it should be a message from system
    if (user2) {
      const systemPm = `[system][${user2.id}]`;

      channel = await Channel.findOne({ where: { pmUsers: systemPm } });
      if (!channel) {
        channel = await Channel.create({ pmUsers: systemPm });
        ChannelSub.create({ channelId: channel.id, userId: user2.id });
      }
    }
  }

  if (!channel) {
    console.log("this should never happen. no channel found");
    return;
  }

  const chatCreated = await ChannelMessage.create({
    userId: user1 && user1.id,
    channelId: channel.id,
    message,
    image: pathImage,
    isSystem,
  });

  if (user1) {
    User.update({ onlineAt: Date.now() }, { where: { id: user1.id } });
  }

  ChannelSub.update(
    { unread: Sequelize.literal(`unread+1`) },
    { where: { channelId: channel.id, userId: { [Op.ne]: user1 && user1.id } } }
  );

  ChannelSub.update(
    {
      lastmessage:
        message.length > 80 ? message.substring(0, 80) + ".." : message,
    },
    { where: { channelId: channel.id } }
  );

  const channelSubs = await ChannelSub.findAll({
    where: { channelId: channel.id, userId: { [Op.ne]: user1 && user1.id } },
    include: { model: User },
  });

  channelSubs.forEach((channelSub) => {
    if (channelSub.user) {
      const getText = getTextFunction(channelSub.user.locale);

      const isOnline = (Date.now() - channelSub.user.onlineAt) / 60000 < 5;
      if (
        channelSub.user.email &&
        channelSub.user.activated &&
        channelSub.user.receiveMessagesMail &&
        !isOnline
      ) {
        //mail

        const html = `<b>${getText(
          "messageFromX",
          title
        )}</b><br /><br />${message}<br /><br />${getText(
          "mailTurnOffInstructions"
        )}`;

        const msg = {
          to: channelSub.user.email,
          from: EMAIL_FROM,
          subject: getText("messageMailSubject"),
          html,
        };

        sgMail.send(msg).then(() => {}, console.error);
      }

      if (channelSub.user.pushtoken) {
        //push notification

        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: channelSub.user.pushtoken,
            title,
            body: message,
            data: { channel: channel.id },
          }),
        })
          .then((result) => console.log("result", result.status))
          .catch((e) => console.log("err", e));
      }
    }
  });
};

const ranks = [
  {
    rank: "Nobody",
    exp: 50,
  },
  {
    rank: "Vandal",
    exp: 150,
  },
  {
    rank: "Little thief",
    exp: 300,
  },
  {
    rank: "Thief",
    exp: 500,
  },
  {
    rank: "Carthief",
    exp: 800,
  },
  {
    rank: "Criminal",
    exp: 1200,
  },
  {
    rank: "Hitman",
    exp: 1800,
  },
  {
    rank: "Dangerous-Hitman",
    exp: 2800,
  },
  {
    rank: "Gangster",
    exp: 4400,
  },
  {
    rank: "Dangerous-Gangster",
    exp: 7600,
  },
  {
    rank: "Godfather",
    exp: 10000,
  },
  {
    rank: "Dangerous-Godfather",
    exp: 15000,
  },
  {
    rank: "Unlimited-Godfather",
    exp: 22000,
  },
  {
    rank: "Don",
    exp: 30000,
  },
  {
    rank: "Dangerous-Don",
    exp: 40000,
  },
  {
    rank: "Unlimited-Don",
    exp: 60000,
  },
];

const strengthRanks = [
  {
    rank: "Very weak",
    exp: 50,
  },
  {
    rank: "Weak",
    exp: 150,
  },
  {
    rank: "Incredibly amature",
    exp: 300,
  },
  {
    rank: "Amature",
    exp: 500,
  },
  {
    rank: "Normal",
    exp: 800,
  },
  {
    rank: "Judoka",
    exp: 1200,
  },
  {
    rank: "A bit strong",
    exp: 1800,
  },
  {
    rank: "Boxer",
    exp: 2800,
  },
  {
    rank: "Strong",
    exp: 4000,
  },
  {
    rank: "Kickbokser",
    exp: 5600,
  },
  {
    rank: "Super strong",
    exp: 7000,
  },
  {
    rank: "Powerful",
    exp: 9000,
  },
  {
    rank: "Very powerful",
    exp: 11000,
  },
  {
    rank: "Super powerful",
    exp: 14000,
  },
  {
    rank: "Ultra deluxe powerful",
    exp: 17000,
  },
  {
    rank: "Inhumanly powerful",
    exp: 20000,
  },
  {
    rank: "Robotly powerful",
    exp: 25000,
  },
  {
    rank: "Godly",
    exp: 30000,
  },
  {
    rank: "Very godly",
    exp: 35000,
  },
  {
    rank: "Super godly",
    exp: 40000,
  },
  {
    rank: "Ultra deluxe godly",
    exp: 45000,
  },
  {
    rank: "God damn strong",
    exp: 50000,
  },
  {
    rank: "King of the gods",
    exp: 60000,
  },
];

const getRankThing = (rank, returntype, type) => {
  const now = type.findIndex((r) => rank < r.exp);
  const prev = now - 1;

  const nowExp = type[now] ? type[now].exp : type[type.length - 1].exp;
  const prevExp = type[prev] ? type[prev].exp : 0;

  const nowRank = type[now] ? type[now].rank : type[type.length - 1].rank; //last rank always

  const diff = nowExp - prevExp;
  const progress = rank - prevExp;
  const percentage = Math.round((progress / diff) * 100 * 100) / 100;

  const number = now !== -1 ? now + 1 : type.length;
  if (returntype === "rankname") {
    return nowRank;
  } else if (returntype === "number") {
    return number;
  } else if (returntype === "percentage") {
    return percentage;
  } else if (returntype === "both") {
    return nowRank + " " + percentage + "%";
  } else {
    return number;
  }
};

const getRank = (rank, returntype) => getRankThing(rank, returntype, ranks);
const getStrength = (rank, returntype) =>
  getRankThing(rank, returntype, strengthRanks);

const fs = require("fs");
const Jimp = require("jimp");
const fileType = require("file-type");
const extensions = ["jpg", "jpeg", "png"];

const saveImageIfValid = (res, base64, thumbnail) => {
  if (!base64) {
    return {};
  }
  // to declare some path to store your converted image
  const path = "./uploads/" + Date.now() + ".png";
  const pathThumbnail = "./uploads/" + Date.now() + "tn.png";

  // to convert base64 format into random filename
  const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, "");
  const mimeInfo = fileType(Buffer.from(base64Data, "base64"));

  if (extensions.includes(mimeInfo && mimeInfo.ext)) {
    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    Jimp.read(path, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(512, 512) // resize
        .write(path); // save
    });

    if (thumbnail) {
      fs.writeFileSync(pathThumbnail, base64Data, { encoding: "base64" });

      Jimp.read(pathThumbnail, (err, image) => {
        if (err) throw err;
        image
          .scaleToFit(100, 100) // resize
          .write(pathThumbnail); // save
      });
    }

    return {
      pathImage: path.substring(1),
      pathThumbnail: thumbnail ? pathThumbnail.substring(1) : undefined,
    };
  } else {
    res.json({ response: "Invalid image" });
    return { invalid: true };
  }
};

module.exports = {
  getRank,
  getStrength,
  sendMessageAndPush,
  saveImageIfValid,
  getTextFunction,
  getLocale,
  needCaptcha,
  sendChatPushMail,
  publicUserFields,
  NUM_ACTIONS_UNTIL_VERIFY,
};
