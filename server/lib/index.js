const express = require("express");
const server = express();
const body_parser = require("body-parser");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const Jimp = require("jimp");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const cron = require("node-cron");

const cities = require("../assets/airport.json");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var cors = require("cors");

const twilio = require("twilio");
const { getRank, sendMessageAndPush, publicUserFields } = require("./util");

var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_SECRET; // Your Auth Token from www.twilio.com/console

var twilioClient = new twilio(accountSid, authToken);

const EMAIL_FROM = "info@mastercrimez.nl";

const allUserFields = publicUserFields.concat([
  "activated",
  "email",
  "bullets",
  "city",
  "backfire",
  "weapon",
  "protection",
  "airplane",
  "home",
  "phoneVerified",
  "pushtoken",
  "credits",
  "attackAt",
  "autostelenAt",
  "crimeAt",
  "reizenAt",
  "jailAt",
  "wietAt",
  "junkiesAt",
  "hoerenAt",
  "gymAt",
  "gymTime",
  "bunkerAt",
  "incomeAt",
  "robAt",
  "ocAt",
  "bombAt",
  "protectionAt",
  "swissBank",
  "rankKnow",
  "swissBullets",
  "needCaptcha",
  "numActions",
]);

function me(token) {
  return User.findOne({
    attributes: publicUserFields,
    where: { loginToken: token },
  });
}

function earthDistance(lat1, long1, lat2, long2, response) {
  const m = Math.PI / 180;

  lat1 = lat1 * m;
  long1 = long1 * m;
  lat2 = lat2 * m;
  long2 = long2 * m;

  var R = 6371e3; // metres of earth radius

  var x = (long2 - long1) * Math.cos((lat1 + lat2) / 2);
  var y = lat2 - lat1;

  var d = Math.sqrt(x * x + y * y) * R;

  return response === "m" ? Math.round(d / 10) * 10 : Math.round(d / 1000); //in kilometers!
}

const sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.DB_DB,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialectOptions: {
    host: process.env.DB_HOST,
    port: "3306",
  },
  logging: null,
});

class User extends Model {}

User.init(
  {
    captcha: DataTypes.INTEGER,
    needCaptcha: DataTypes.BOOLEAN,
    numActions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    loginToken: DataTypes.STRING,
    activationToken: DataTypes.STRING,
    forgotPasswordToken: DataTypes.STRING,
    activated: DataTypes.BOOLEAN,
    level: DataTypes.INTEGER,
    pushtoken: DataTypes.STRING,

    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    creditsTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rankKnow: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    phone: DataTypes.STRING,
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    phoneVerificationCode: DataTypes.INTEGER,

    email: DataTypes.STRING,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.TEXT,
    accomplice: DataTypes.STRING,
    accomplice2: DataTypes.STRING,
    accomplice3: DataTypes.STRING,
    accomplice4: DataTypes.STRING,

    onlineAt: DataTypes.BIGINT,
    autostelenAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    gymTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    crimeAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    reizenAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    jailAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    bombAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    wietAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    junkiesAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    hoerenAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    gymAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    bunkerAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    incomeAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    attackAt: {
      type: DataTypes.BIGINT, //wanneer je HEBT aangevallen
      defaultValue: 0,
    },

    attackedAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    robbedAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    robAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    ocAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    protectionAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    home: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    airplane: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    garage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    protection: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    weapon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    wiet: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    junkies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hoeren: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    strength: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    cash: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    gamepoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    bank: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    swissBank: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    swissBullets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    bullets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    backfire: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    health: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },

    city: {
      type: DataTypes.STRING,
      defaultValue: "Amsterdam",
    },

    password: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

class Streetrace extends Model {}

Streetrace.init(
  {
    city: DataTypes.STRING,
    numParticipants: DataTypes.INTEGER,
    type: DataTypes.STRING,
    price: DataTypes.INTEGER,
    creator: DataTypes.STRING,
  },
  { sequelize, modelName: "streetrace" }
);

class StreetraceParticipant extends Model {}

StreetraceParticipant.init(
  {
    streetraceId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    car: DataTypes.STRING,
    image: DataTypes.STRING,
    power: DataTypes.INTEGER,
  },
  { sequelize, modelName: "streetraceParticipant" }
);

class City extends Model {}

City.init(
  {
    city: DataTypes.STRING,
    bullets: DataTypes.INTEGER,
    bulletFactoryOwner: DataTypes.STRING,
    bulletFactoryPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    bulletFactoryProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bulletFactoryDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    casinoOwner: DataTypes.STRING,
    casinoProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    casinoDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    rldOwner: DataTypes.STRING,
    rldProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rldDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    landlordOwner: DataTypes.STRING,
    landlordProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    landlordDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    junkiesOwner: DataTypes.STRING,
    junkiesProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    junkiesDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    weaponShopOwner: DataTypes.STRING,
    weaponShopProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    weaponShopDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    estateAgentOwner: DataTypes.STRING,
    estateAgentProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    estateAgentDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    garageOwner: DataTypes.STRING,
    garageProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    garageDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    airportOwner: DataTypes.STRING,
    airportProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    airportDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    jailOwner: DataTypes.STRING,
    jailProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    jailPutAt: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    jailDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    bankOwner: DataTypes.STRING,
    bankProfit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bankDamage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "city" }
);
class Garage extends Model {}

Garage.init(
  {
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    auto: DataTypes.STRING,
    image: DataTypes.STRING,
    cash: DataTypes.INTEGER,
    power: DataTypes.INTEGER,
    kogels: DataTypes.INTEGER,
  },
  { sequelize, modelName: "garage" }
);

class Chat extends Model {}

Chat.init(
  {
    name: DataTypes.STRING,
    message: DataTypes.TEXT,
  },
  { sequelize, modelName: "chat" }
);

class Payment extends Model {}

Payment.init(
  {
    paymentId: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    credits: DataTypes.INTEGER,
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "payment" }
);

class Image extends Model {}

Image.init(
  {
    image: DataTypes.STRING,
    uid: DataTypes.INTEGER,
  },
  { sequelize, modelName: "image" }
);

class Channel extends Model {}

Channel.init(
  {
    name: DataTypes.STRING,
    pmUsers: DataTypes.STRING, // format [uid1][uid2]
  },
  {
    sequelize,
    modelName: "channel",
  }
);

class ChannelSub extends Model {}

ChannelSub.init(
  {
    unread: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastmessage: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "channelsub",
  }
);
ChannelSub.belongsTo(Channel);
Channel.hasMany(ChannelSub);

ChannelSub.belongsTo(User, { constraints: false });
User.hasMany(ChannelSub, { constraints: false });

class ChannelMessage extends Model {}

ChannelMessage.init(
  {
    message: DataTypes.TEXT,
    image: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "channelMessage",
  }
);
ChannelMessage.belongsTo(User, { constraints: false });
User.hasMany(ChannelMessage, { constraints: false });

ChannelMessage.belongsTo(Channel);
Channel.hasMany(ChannelMessage);

class Movement extends Model {}

Movement.init(
  {
    userId: DataTypes.INTEGER,
    action: DataTypes.STRING,
    locationX: DataTypes.FLOAT,
    locationY: DataTypes.FLOAT,
    timestamp: DataTypes.BIGINT,
  },
  { sequelize, modelName: "movement" }
);

class Message extends Model {}

Message.init(
  {
    from: DataTypes.INTEGER,
    fromName: DataTypes.STRING,
    to: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, modelName: "message" }
);

class ForumTopic extends Model {}

ForumTopic.init(
  {
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.TEXT,
    responses: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "forum_topic" }
);

class ForumResponse extends Model {}

ForumResponse.init(
  {
    name: DataTypes.STRING,
    topicId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
  },
  { sequelize, modelName: "forum_response" }
);

StreetraceParticipant.belongsTo(Streetrace, {
  foreignKey: "streetraceId",
});
Streetrace.hasMany(StreetraceParticipant, {
  foreignKey: "streetraceId",
});

try {
  sequelize.sync({ alter: true }); //{alter}:true}
} catch (e) {
  console.log("e", e);
}

server.use(body_parser.json({ limit: "10mb", extended: true }));
server.use(body_parser.urlencoded({ limit: "10mb", extended: true }));

server.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

server.enable("trust proxy");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //1minute
  max: 120, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
server.use(limiter);

server.use("/images", express.static("images"));
server.use("/uploads", express.static("uploads"));

/** ENDPOINTS  */

server.post("/upload", async (req, res, next) => {
  const { image, token } = req.body;

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Verkeerd token" });
    return;
  }

  try {
    // to declare some path to store your converted image
    const path = "./uploads/" + Date.now() + ".png";
    // to convert base64 format into random filename
    const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, "");

    fs.writeFileSync(path, base64Data, { encoding: "base64" });

    Jimp.read(path, (err, image) => {
      if (err) throw err;
      image
        .scaleToFit(512, 512) // resize
        .write(path); // save
    });

    Image.create({ image: path, uid: user.id });

    return res.json({ path, response: "Gelukt" });
  } catch (e) {
    next(e);
  }
});

server.get("/listimages", async (req, res) => {
  const { token, uid } = req.query;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  const images = await Image.findAll({ where: { uid } });

  res.json({
    images: images,
  });
});

server.post("/deleteimage", async (req, res) => {
  const { token, id } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  const image = await Image.findOne({ where: { id: id, uid: user.id } });

  if (image) {
    image.destroy();
  }

  res.json({
    reponse: "success",
  });
});

server.get("/garage", (req, res) =>
  require("./garage").garage(req, res, User, Garage)
);

server.get("/racecars", (req, res) =>
  require("./garage").racecars(req, res, User, Garage)
);

server.get("/garageGrouped", (req, res) =>
  require("./garage").garageGrouped(req, res, User, Garage, sequelize)
);

server.post("/sellcar", (req, res) =>
  require("./garage").sellcar(req, res, User, Garage)
);

server.post("/buyBullets", (req, res) =>
  require("./buyBullets").buyBullets(req, res, sequelize, User, City)
);
server.post("/bomb", (req, res) =>
  require("./bomb").bomb(req, res, sequelize, User, City, Message)
);

server.get("/cities", (req, res) => require("./cities").cities(req, res, City));

server.post("/crushcar", (req, res) =>
  require("./garage").crushcar(req, res, User, Garage)
);

server.post("/upgradecar", (req, res) =>
  require("./garage").upgradecar(req, res, User, Garage)
);

server.post("/bulkaction", (req, res) =>
  require("./garage").bulkaction(req, res, User, Garage)
);

server.post("/stealcar", (req, res) =>
  require("./stealcar").stealcar(req, res, User, Garage)
);

server.post("/removeprotection", (req, res) =>
  require("./removeprotection").removeprotection(req, res, User)
);

server.post("/crime", (req, res) => require("./crime").crime(req, res, User));

server.post("/gym", (req, res) => require("./gym").gym(req, res, User));

server.post("/hoeren", (req, res) =>
  require("./hoeren").hoeren(req, res, User)
);

server.post("/becomeOwner", (req, res) =>
  require("./manageObject").becomeOwner(req, res, User, City)
);
server.post("/giveAway", (req, res) =>
  require("./manageObject").giveAway(req, res, User, City, Message)
);
server.post("/changePrice", (req, res) =>
  require("./manageObject").changePrice(req, res, User, City)
);
server.post("/switchStatus", (req, res) =>
  require("./manageObject").switchStatus(req, res, User, City)
);
server.post("/getProfit", (req, res) =>
  require("./manageObject").getProfit(req, res, sequelize, User, City)
);

server.post("/repairObject", (req, res) =>
  require("./manageObject").repairObject(req, res, sequelize, User, City)
);

server.post("/putInJail", (req, res) =>
  require("./manageObject").putInJail(req, res, User, City, Message)
);

server.post("/wiet", (req, res) => require("./wiet").wiet(req, res, User));

server.post("/junkies", (req, res) =>
  require("./junkies").junkies(req, res, User)
);

// server.get("/showroom", (req, res) =>
//   require("./showroom").showroom(req, res, User, Garage)
// );

server.post("/buycar", (req, res) =>
  require("./showroom").buycar(req, res, User, Garage)
);

server.post("/donate", (req, res) =>
  require("./donate").donate(req, res, User, Message)
);

server.post("/bunker", (req, res) =>
  require("./bunker").bunker(req, res, User)
);

server.get("/creditshop", (req, res) =>
  require("./creditshop").creditshop(req, res, User)
);

server.post("/creditshopBuy", (req, res) =>
  require("./creditshop").creditshopBuy(req, res, User)
);

server.get("/jail", (req, res) => require("./jail").jail(req, res, User));
server.post("/breakout", (req, res) =>
  require("./jail").breakout(req, res, User, Message)
);

server.post("/buyout", (req, res) =>
  require("./jail").buyout(req, res, User, Message, City)
);

server.post("/poker", (req, res) =>
  require("./poker").poker(req, res, User, City)
);

server.post("/bank", (req, res) => require("./bank").bank(req, res, User));

server.post("/swissBank", (req, res) =>
  require("./swissBank").swissBank(req, res, User)
);

server.post("/airport", (req, res) =>
  require("./airport").airport(req, res, User)
);

server.post("/movementsApp", (req, res) =>
  require("./movements").movementsApp(req, res, User, Movement)
);

server.post("/createStreetrace", (req, res) =>
  require("./streetrace").createStreetrace(
    req,
    res,
    User,
    Streetrace,
    StreetraceParticipant,
    Garage,
    Message
  )
);

server.get("/streetraces", (req, res) =>
  require("./streetrace").streetraces(
    req,
    res,
    User,
    Streetrace,
    StreetraceParticipant,
    Garage,
    Message
  )
);

server.post("/joinStreetrace", (req, res) =>
  require("./streetrace").joinStreetrace(
    req,
    res,
    User,
    Streetrace,
    StreetraceParticipant,
    Garage,
    Message
  )
);

server.post("/leaveStreetrace", (req, res) =>
  require("./streetrace").leaveStreetrace(
    req,
    res,
    User,
    Streetrace,
    StreetraceParticipant,
    Garage,
    Message
  )
);

server.post("/startStreetrace", (req, res) =>
  require("./streetrace").startStreetrace(
    req,
    res,
    User,
    Streetrace,
    StreetraceParticipant,
    Garage,
    Message
  )
);

server.post("/income", (req, res) =>
  require("./income").income(req, res, sequelize, User, City)
);

server.post("/rob", (req, res) =>
  require("./rob").rob(req, res, User, Message)
);

server.post("/hospital", (req, res) =>
  require("./hospital").hospital(req, res, User, Message)
);

server.post("/kill", (req, res) =>
  require("./kill").kill(req, res, User, Message, Garage, City)
);

server.post("/oc", (req, res) => require("./oc").oc(req, res, User, Message));

server.post("/getalive", (req, res) =>
  require("./kill").getalive(req, res, User, Message, Garage)
);

server.post("/admin/email", (req, res) =>
  require("./admin_email").email(req, res, User)
);

//messages
server.post("/message", (req, res) =>
  require("./message").message(req, res, User, Message)
);
server.get("/messages", (req, res) =>
  require("./message").messages(req, res, User, Message)
);
server.post("/readMessage", (req, res) =>
  require("./message").readMessage(req, res, User, Message)
);
server.post("/deleteMessage", (req, res) =>
  require("./message").deleteMessage(req, res, User, Message)
);

//forum
server.post("/topic", (req, res) =>
  require("./forum").newTopic(req, res, User, ForumTopic)
);
server.post("/response", (req, res) =>
  require("./forum").response(
    req,
    res,
    User,
    ForumTopic,
    ForumResponse,
    Message
  )
);
server.get("/topics", (req, res) =>
  require("./forum").topics(req, res, User, ForumTopic, ForumResponse)
);
server.get("/topic", (req, res) =>
  require("./forum").getTopic(req, res, User, ForumTopic, ForumResponse)
);

server.post("/setAccomplice", (req, res) =>
  require("./accomplice").setAccomplice(req, res, User)
);

server.post("/mollieCreate", (req, res) =>
  require("./mollieCreate").mollieCreate(req, res, User, Payment)
);
server.post("/mollieWebhook", (req, res) =>
  require("./mollieWebhook").mollieWebhook(req, res, User, Payment)
);
server.get("/shop", (req, res) => require("./shop").shop(req, res, User));

server.post("/superMessage", (req, res) =>
  require("./superMessage").superMessage(req, res, User, Message)
);

server.post("/buy", (req, res) => require("./shop").buy(req, res, User, City));

server.get("/chat", (req, res) => {
  Chat.findAll({ order: [["id", "DESC"]], limit: 10 }).then((chat) => {
    res.json(chat);
  });
});

server.get("/channelsubs", (req, res) =>
  require("./channelsubs").channelsubs(req, res, User, ChannelSub, Channel)
);

server.get("/pm", (req, res) =>
  require("./channelsubs").pm(req, res, User, ChannelSub, Channel)
);
server.post("/setRead", (req, res) =>
  require("./channelsubs").setRead(req, res, User, ChannelSub, Channel)
);

server
  .get("/channelmessage", (req, res) =>
    require("./channelmessage").getChat(req, res, {
      User,
      ChannelMessage,
      ChannelSub,
    })
  )
  .post("/channelmessage", (req, res) =>
    require("./channelmessage").postChat(req, res, {
      User,
      ChannelMessage,
      ChannelSub,
      sequelize,
    })
  );

server.post("/chat", async (req, res) => {
  const { message, token } = req.body;

  const user = await User.findOne({ where: { loginToken: token } });

  if (user && message) {
    Chat.create({ name: user.name, message }).then((chat) => {
      res.json(chat);
    });
  } else {
    res.json({ response: "invalid token" });
  }
});

server.get("/profile", (req, res) => {
  User.findOne({
    attributes: publicUserFields,
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", req.query.name)
      ),
    },
  }).then(async (user) => {
    if (user) {
      const accomplices = await User.findAll({
        attributes: ["name", "rank"],
        where: Sequelize.or(
          { accomplice: user.name },
          { accomplice2: user.name },
          { accomplice3: user.name },
          { accomplice4: user.name }
        ),
      });

      let extended = user;
      extended.dataValues.accomplices = accomplices;

      res.json(extended);
    } else {
      res.json(null);
    }
  });
});

server.get("/members", (req, res) => {
  //return coordinatesets that are located in a square of lat/lng

  const { order } = req.query;
  const validOrders = [
    "onlineAt",
    "bank",
    "cash",
    "name",
    "hoeren",
    "junkies",
    "wiet",
    "rank",
    "strength",
  ];
  const validOrder = validOrders.includes(order) ? order : validOrders[0];

  User.findAll({
    attributes: publicUserFields,
    order: [[validOrder, "DESC"]],
    limit: 100,
    where: { health: { [Op.gt]: 0 } },
  }).then((user) => {
    res.json(user);
  });
});

server.get("/stats", async (req, res) => {
  //return coordinatesets that are located in a square of lat/lng

  const stats = [
    "createdAt",
    "bank",
    "hoeren",
    "junkies",
    "wiet",
    "rank",
    "strength",
    "gamepoints",
  ];

  const allStats = await Promise.all(
    stats.map(async (stat) => ({
      [stat]: await User.findAll({
        attributes: ["name", stat],
        order: [[stat, "DESC"]],
        limit: 10,
        where: { health: { [Op.gt]: 0 } },
      }),
    }))
  );

  const newMembers = await User.findAll({
    attributes: ["name"],
    where: {
      phoneVerified: true,
      createdAt: { [Op.gt]: Date.now() - 86400000 },
    },
  });

  const onlineToday = await User.count({
    where: {
      phoneVerified: true,
      onlineAt: { [Op.gt]: Date.now() - 86400000 },
    },
  });

  allStats.push({
    newMembers: newMembers.map((x) => x.dataValues.name).join(", "),
  });
  allStats.push({ onlineToday });

  res.json(allStats);
});

server.get("/me", (req, res) => {
  if (!req.query.token) {
    res.json({ response: "Geen correct token gegeven" });
  }
  User.findOne({
    attributes: allUserFields,
    where: { loginToken: req.query.token },
  })
    .then(async (user) => {
      if (user) {
        const messages = await Message.findAll({
          attributes: ["id"],
          where: { to: user.id, read: false },
        });

        const jail = await User.findAll({
          attributes: ["id"],
          where: { jailAt: { [Op.gt]: Date.now() } },
        });

        const online = await User.findAll({
          attributes: ["id"],
          where: { onlineAt: { [Op.gt]: Date.now() - 300000 } },
        });

        const [[position]] = await sequelize.query(
          `SELECT COUNT(id) AS amount FROM users WHERE rank > ${user.rank}`
        );

        const [[chats]] = await sequelize.query(
          `SELECT SUM(unread) AS unread FROM channelsubs WHERE userId=${user.id};`
        );

        const accomplices = await User.findAll({
          attributes: ["name", "rank"],
          where: Sequelize.or(
            { accomplice: user.name },
            { accomplice2: user.name },
            { accomplice3: user.name },
            { accomplice4: user.name }
          ),
        });

        const userWithMessages = user.dataValues;
        userWithMessages.accomplices = accomplices;
        userWithMessages.position = position.amount + 1;
        userWithMessages.messages = messages.length;
        userWithMessages.chats = chats.unread || 0;
        userWithMessages.jail = jail.length;
        userWithMessages.online = online.length;

        const rankNow = getRank(user.rank, "number");
        if (rankNow > user.rankKnow) {
          sendMessageAndPush(
            { id: null, name: "(System)" },
            user,
            `Je rang is opgehoogd naar ${getRank(user.rank, "rankname")}.`,
            Message,
            true
          );
          User.update({ rankKnow: rankNow }, { where: { id: user.id } });
        }

        res.json(userWithMessages);

        User.update(
          { onlineAt: Date.now() },
          { where: { loginToken: req.query.token } }
        );
      } else {
        const name = await getAvailableName();
        const user = await User.create({
          loginToken: req.query.token,
          name,
        });

        const newuser = await User.findOne({
          attributes: allUserFields,
          where: { loginToken: req.query.token },
        });

        const messages = await Message.findAll({
          where: { to: newuser.id, read: false },
        });

        const jail = await User.findAll({
          attributes: ["id"],
          where: { jailAt: { [Op.gt]: Date.now() } },
        });

        const online = await User.findAll({
          attributes: ["id"],
          where: { onlineAt: { [Op.gt]: Date.now() - 300000 } },
        });

        const [[position]] = await sequelize.query(
          `SELECT COUNT(id) AS amount FROM users WHERE rank > ${newuser.rank}`
        );

        const [[chats]] = await sequelize.query(
          `SELECT SUM(unread) AS unread FROM channelsubs WHERE userId=${newuser.id};`
        );

        const accomplices = await User.findAll({
          attributes: ["name", "rank"],
          where: Sequelize.or(
            { accomplice: newuser.name },
            { accomplice2: newuser.name },
            { accomplice3: newuser.name },
            { accomplice4: newuser.name }
          ),
        });

        const userWithMessages = newuser.dataValues;
        userWithMessages.messages = messages.length;
        userWithMessages.jail = jail.length;
        userWithMessages.online = online.length;
        userWithMessages.accomplices = accomplices;
        userWithMessages.position = position.amount + 1;
        userWithMessages.chats = chats.unread || 0;

        res.json(userWithMessages);
      }
    })
    .catch((e) => console.log(e));
});

server.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    const forgotPasswordToken = Math.round(Math.random() * 999999999);

    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: "Wachtwoord resetten mastercrimez.nl",
      text: `Klik op de link om je wachtwoord te resetten: https://mastercrimez.nl/#/RecoverPassword/${forgotPasswordToken}`,
    };

    User.update({ forgotPasswordToken }, { where: { email: user.email } });

    //ES6
    sgMail.send(msg).then(() => {
      res.json({ success: "Check je mail om je wachtwoord te resetten" });
    }, console.error);
  } else {
    res.json({ error: "Email niet gevonden" });
  }
});

server.post("/updateToken", async (req, res) => {
  const { loginToken, newLoginToken } = req.body;

  if (!loginToken) {
    return res.json({ response: "No token given" });
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "No user found" });
  }

  if (!newLoginToken) {
    return res.json({ response: "no new login token given" });
  }

  if (newLoginToken.length < 15) {
    return res.json({ response: "Token too short" });
  }

  const already = await User.findOne({ where: { loginToken: newLoginToken } });
  if (already) {
    return res.json({ response: "already" });
  }

  User.update({ loginToken: String(newLoginToken) }, { where: { loginToken } });

  console.log({ response: "Success", success: true, token: newLoginToken });
  return res.json({ response: "Success", success: true });
});

server.post("/forgotPassword2", async (req, res) => {
  const { token, password } = req.body;

  const updated = await User.update(
    { password },
    { where: { forgotPasswordToken: token } }
  );

  if (updated[0] === 1) {
    res.json({ success: "Wachtwoord gereset" });
  } else {
    res.json({ error: "Email/token niet gevonden" });
  }
});

function isEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function randomEntry(array) {
  return array[Math.floor(array.length * Math.random())];
}

const getAvailableName = async () => {
  const names = [
    "butje",
    "sukkel",
    "gozer",
    "gappie",
    "gabber",
    "gastje",
    "gast",
    "gemenerik",
    "gek",
    "crimert",
    "gangster",
  ];
  const name = randomEntry(names);
  const number = Math.round(Math.random() * 1000);

  const fullname = name + number;

  const already = await User.findOne({ where: { name: fullname } });

  if (already) {
    return getAvailableName();
  }
  return fullname;
};

server.post("/signupEmail", async (req, res) => {
  const { email, loginToken } = req.body;
  console.log("SIGNUPEMAIL");

  if (!loginToken || !email) {
    res.json({ error: "Ongeldige invoer" });
    return;
  }

  const emailAlready = await User.findOne({
    where: { email, loginToken: { [Op.ne]: loginToken } },
  });

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ error: "Ongeldig token" });
    return;
  }

  if (emailAlready) {
    res.json({ error: "Email is al in gebruik" });
  } else if (!isEmail(email)) {
    res.json({ error: "Dat is geen geldig emailadres" });
  } else {
    const activationToken = Math.round(Math.random() * 999999999);

    User.update(
      { email, activationToken, activated: false },
      { where: { loginToken } }
    );
    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: "Email bevestigen mastercrimez.nl",
      html: `Klik <a href="https://mastercrimez.nl/#/SignupEmail2/${activationToken}">hier</a> om je aanmelding te voltooien.`,
    };

    //ES6
    sgMail
      .send(msg)
      .then((response) => {
        res.json({ success: "Check je mail om je account te activeren" });
      }, console.error)
      .catch((e) => console.log(e));
  }
});

/**
 *  just activates an account if activationtoken given is correct
 */
server.post("/activate", async (req, res) => {
  const { activationToken } = req.body;

  if (activationToken) {
    const user = await User.update(
      { activated: true },
      { where: { activationToken, activated: false } }
    );

    if (user[0] === 1) {
      res.json({ response: "Gelukt" });
    } else {
      res.json({ response: "Deze link is ongeldig" });
    }
  }
});

server.post("/updateProfile", async (req, res) => {
  const { loginToken, image, backfire, bio, pushtoken } = req.body;

  if (!loginToken) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  let update = {};

  if (image) {
    update.image = image;
  }

  if (bio) {
    update.bio = bio;
  }

  if (pushtoken !== undefined) {
    update.pushtoken = pushtoken;
  }

  if (backfire !== undefined && backfire >= 0 && backfire <= 1) {
    update.backfire = backfire;
  }

  if (loginToken) {
    const user = await User.update(update, { where: { loginToken } });
    res.json({ user });
  }
});

server.post("/setPhone", async (req, res) => {
  console.log("SET PHOEN");
  const { phone, token } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (!phone) {
    res.json({ response: "Geef een telefoonnummer op" });
    return;
  }

  const validNumber = /([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}/g;

  if (phone.length < 12 || !phone.match(validNumber)) {
    res.json({
      response:
        "Geef een valide telefoonnummer op, inclusief landcode (dus beginnend met +316)",
    });
    return;
  }

  // if (user.phone === phone) {
  //   return res.json({ response: "Dit is jouw telefoonnummer al" });
  // }

  const already = await User.findOne({ where: { phone, phoneVerified: true } });

  const phoneVerificationCode = Math.round(Math.random() * 999999);
  let update = { phone, phoneVerified: false, phoneVerificationCode };

  res.json({ success: true });

  twilioClient.messages
    .create({
      body: `Je MasterCrimeZ verificatiecode is ${phoneVerificationCode}`,
      to: phone,
      from: process.env.TWILIO_PHONE_FROM,
    })
    .then(async (message) => {
      const [updated] = await User.update(update, {
        where: { loginToken: already ? already.loginToken : token },
      });
      console.log(message);
    })
    .catch((e) => {
      console.log("error", e);

      res.json({ success: false, response: "Ongeldig telefoonnummer" });
    });
});

server.post("/verifyPhone", async (req, res) => {
  const { phone, code } = req.body;

  if (!code || !phone) {
    res.json({ response: "Geef een code op" });
    return;
  }

  //NB: je kan nu gewoon 1mil keer proberen, dit kan binnen een dag. en dan is je account geverifieerd. dit mot anders

  const verifiedUser = await User.findOne({
    where: {
      phone,
      phoneVerificationCode: code,
      phoneVerified: false,
    },
  });

  if (verifiedUser) {
    const updated = await User.update(
      { phoneVerified: true },
      { where: { id: verifiedUser.id } }
    );

    console.log("updated", updated);

    return res.json({
      success: true,
      token: verifiedUser.loginToken,
      response: "Gelukt.",
    });
  } else {
    return res.json({ success: false, response: "Verkeerde code" });
  }
});

server.post("/updateName", async (req, res) => {
  const { loginToken, name } = req.body;

  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }
  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (!name) {
    res.json({ response: "Deze naam is te kort" });
    return;
  }
  var realname = name.replace(/[^a-z0-9]/gi, "");

  if (realname.length < 2) {
    res.json({ response: "Deze naam is te kort" });
    return;
  }

  if (realname.length > 20) {
    res.json({ response: "Deze naam is te lang" });
    return;
  }

  const already = await User.findOne({
    where: {
      $and: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", realname)
      ),
    },
  });

  if (already) {
    res.json({ response: "Deze naam is al bezet." });
    return;
  }

  if (loginToken) {
    const updatedUser = await User.update(
      { name: realname },
      { where: { loginToken } }
    );

    const properties = [
      "bulletFactory",
      "casino",
      "rld",
      "landlord",
      "junkies",
      "weaponShop",
      "airport",
      "estateAgent",
      "garage",
      "jail",
      "bank",
    ];

    //properties
    properties
      .map((p) => `${p}Owner`)
      .map(async (x) => {
        const [updated] = await City.update(
          { [x]: realname },
          { where: { [x]: user.name } }
        );
        return updated;
      });

    res.json({ response: "Naam veranderd" });
  }
});

server.post("/changePassword", async (req, res) => {
  const { token, password } = req.body;

  if (token) {
    const user = await User.update(
      { password },
      { where: { loginToken: token } }
    );
    if (user[0] === 1) {
      res.json({ success: "Wachtwoord veranderd" });
    } else {
      res.json({ error: "No correct token" });
    }
  } else {
    res.json({ error: "No correct token" });
  }
});

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
      password,
    },
  });

  if (user) {
    res.json({
      loginToken: user.loginToken,
      success: `Je bent ingelogd op ${user.name}`,
    });
  } else {
    res.json({ error: "Email/wachtwoord komen niet overeen" });
  }
});

const zcaptcha = require("./captcha");

const getCaptcha = async (req, res) => {
  const { loginToken } = req.query;
  if (!loginToken) {
    return res.json({ response: "No token given" });
  }
  const code = Math.random().toString().substr(2, 4);
  const image = await zcaptcha.getCaptcha(code, undefined, "transparent");
  res.writeHead(200, {
    "Content-Type": "image/png",
  });

  User.update({ captcha: code }, { where: { loginToken } });

  return res.end(image, "binary");
};

server.get("/captcha.png", getCaptcha);

/*
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second ( optional )
*/

//elk uur

const putBulletsInBulletFactories = async () => {
  const online = await User.findAll({
    where: { onlineAt: { [Op.gt]: Date.now() - 300000 } },
  });

  const newBullets = online.length * 1000;

  sequelize.query(`UPDATE cities SET bullets=bullets+${newBullets}`);
};

const giveInterest = () => {
  console.log("rente", new Date());
  sequelize.query(`UPDATE users SET bank=ROUND(bank*1.05) WHERE health > 0`);
};

const deadPeopleTax = () => {
  sequelize.query(
    `UPDATE users SET gamepoints = ROUND(gamepoints * 0.95) WHERE health = 0`
  );
};

const swissBankTax = async () => {
  const TAX = 0.02; //NB profit is 50% of this
  await Promise.all(
    cities.map(async (city) => {
      const [[totals]] = await sequelize.query(
        `SELECT SUM(swissBank) AS swissBank, SUM(swissBullets) AS swissBullets FROM users WHERE city= '${city}'`
      );

      const bankProfit = Math.round(totals.swissBank * TAX * 0.5);

      City.update(
        {
          bankProfit: Sequelize.literal(`bankProfit + ${bankProfit}`),
        },
        { where: { city } }
      );
    })
  );

  sequelize.query(
    `UPDATE users SET swissBank=ROUND(swissBank*0.98), swissBullets=ROUND(swissBullets*0.98)`
  );
};

if (process.env.NODE_APP_INSTANCE == 0) {
  console.log("Scheduling CRONS....");
  //elk uur
  cron.schedule("0 * * * *", async () => {
    putBulletsInBulletFactories();
  });

  cron.schedule("0 19 * * *", function () {
    //send push notification that happy hour is started
  });

  //8 uur savonds

  cron.schedule("0 20 * * *", function () {
    giveInterest();
    deadPeopleTax();
    swissBankTax();
  });
}

const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
