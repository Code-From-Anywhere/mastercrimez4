const express = require("express");
const server = express();
const body_parser = require("body-parser");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const Jimp = require("jimp");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const cron = require("node-cron");

require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var cors = require("cors");

const twilio = require("twilio");

var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_SECRET; // Your Auth Token from www.twilio.com/console

var twilioClient = new twilio(accountSid, authToken);

const EMAIL_FROM = "info@mastercrimez.nl";

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
  "creditsTotal",
];

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
  "protectionAt",
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
    autostelenAt: DataTypes.BIGINT,
    crimeAt: DataTypes.BIGINT,
    reizenAt: DataTypes.BIGINT,
    jailAt: DataTypes.BIGINT,
    wietAt: DataTypes.BIGINT,
    junkiesAt: DataTypes.BIGINT,
    hoerenAt: DataTypes.BIGINT,
    gymAt: DataTypes.BIGINT,
    gymTime: DataTypes.BIGINT,
    bunkerAt: DataTypes.BIGINT,
    incomeAt: DataTypes.BIGINT,

    attackAt: DataTypes.BIGINT, //wanneer je HEBT aangevallen
    attackedAt: DataTypes.BIGINT, //wanneer je bent aangevallen
    robbedAt: DataTypes.BIGINT, //wanneer je bent berooft
    robAt: DataTypes.BIGINT, //wanneer je HEBT beroofd
    ocAt: DataTypes.BIGINT,
    protectionAt: DataTypes.BIGINT,

    home: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    airplane: {
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
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    gamepoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    bank: {
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

class City extends Model {}

City.init(
  {
    city: DataTypes.STRING,
    bullets: DataTypes.INTEGER,
    bulletFactoryOwner: DataTypes.STRING,
    bulletPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    bulletFactoryProfit: {
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
  require("./buyBullets").buyBullets(req, res, User, City)
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
  require("./jail").breakout(req, res, User)
);

server.post("/bank", (req, res) => require("./bank").bank(req, res, User));

server.post("/airport", (req, res) =>
  require("./airport").airport(req, res, User)
);

server.post("/income", (req, res) =>
  require("./income").income(req, res, User)
);

server.post("/rob", (req, res) =>
  require("./rob").rob(req, res, User, Message)
);

server.post("/hospital", (req, res) =>
  require("./hospital").hospital(req, res, User, Message)
);

server.post("/kill", (req, res) =>
  require("./kill").kill(req, res, User, Message, Garage)
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
  require("./forum").response(req, res, User, ForumTopic, ForumResponse)
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

server.post("/buy", (req, res) => require("./shop").buy(req, res, User));

server.get("/chat", (req, res) => {
  Chat.findAll({ order: [["id", "DESC"]], limit: 10 }).then((chat) => {
    res.json(chat);
  });
});

server.post("/chat", async (req, res) => {
  const { message, token } = req.body;

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
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

  const newMembers = await User.count({
    where: { createdAt: { [Op.gt]: Date.now() - 86400000 } },
  });

  const onlineToday = await User.count({
    where: { onlineAt: { [Op.gt]: Date.now() - 86400000 } },
  });

  allStats.push({ newMembers });
  allStats.push({ onlineToday });

  res.json(allStats);
});

server.get("/me", (req, res) => {
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

        const userWithMessages = user.dataValues;
        userWithMessages.messages = messages.length;
        userWithMessages.jail = jail.length;
        userWithMessages.online = online.length;

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

        const userWithMessages = newuser.dataValues;
        userWithMessages.messages = messages.length;
        userWithMessages.jail = jail.length;
        userWithMessages.online = online.length;

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
      text: `Klik op de link om je aanmelding te voltooien: https://mastercrimez.nl/#/SignupEmail2/${activationToken}`,
    };

    //ES6
    sgMail.send(msg).then(() => {
      res.json({ success: "Check je mail om je account te activeren" });
    }, console.error);
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
      response: "Geef een valide telefoonnummer op, inclusief landcode",
    });
    return;
  }

  const already = await User.findOne({ where: { phone, phoneVerified: true } });

  if (already) {
    return res.json({ response: "Er is al iemand met dit telefoonnummer" });
  }

  const phoneVerificationCode = Math.round(Math.random() * 999999);
  let update = { phone, phoneVerified: false, phoneVerificationCode };

  twilioClient.messages
    .create({
      body: `Je MasterCrimeZ verificatiecode is ${phoneVerificationCode}`,
      to: phone,
      from: process.env.TWILIO_PHONE_FROM,
    })
    .then(async (message) => {
      const [updated] = await User.update(update, {
        where: { loginToken: token },
      });
      res.json({ success: true });

      console.log(message);
    })
    .catch((e) => {
      console.log("error", e);

      res.json({ success: false, response: "Ongeldig telefoonnummer" });
    });
});

server.post("/verifyPhone", async (req, res) => {
  const { code, token } = req.body;

  if (!token) {
    res.json({ response: "Geen token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: "Ongeldige user" });
    return;
  }

  if (!code) {
    res.json({ response: "Geef een code op" });
    return;
  }

  //NB: je kan nu gewoon 1mil keer proberen, dit kan binnen een dag. en dan is je account geverifieerd. dit mot anders

  const verifiedUser = await User.findOne({
    where: {
      phoneVerificationCode: code,
      loginToken: token,
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
      response: "Gelukt.",
    });
  } else {
    return res.json({ success: false, response: "Verkeerde code" });
  }
});

server.post("/updateName", async (req, res) => {
  const { loginToken, name } = req.body;

  if (!name) {
    res.json({ response: "Deze naam is te kort" });
    return;
  }
  var realname = name.replace(/[^a-z0-9]/gi, "");

  if (realname.length < 6) {
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
    const user = await User.update(
      { name: realname },
      { where: { loginToken } }
    );
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
  sequelize.query(`UPDATE users SET bank=bank*1.05 WHERE health > 0`);
};

//elk uur
cron.schedule("0 * * * *", async () => {
  putBulletsInBulletFactories();
});

//8 uur savonds
cron.schedule("0 20 * * *", function () {
  giveInterest();
});

const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
