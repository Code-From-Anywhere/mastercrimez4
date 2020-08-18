const fetch = require("node-fetch");

const needCaptcha = () => true; //Math.round(Math.random() * 50) === 1;

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

const ranks = [
  {
    rank: "Nietsnut",
    exp: 50,
  },
  {
    rank: "Vandaal",
    exp: 150,
  },
  {
    rank: "Jatter",
    exp: 300,
  },
  {
    rank: "Dief",
    exp: 500,
  },
  {
    rank: "Autodief",
    exp: 800,
  },
  {
    rank: "Crimineel",
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
    rank: "Ultra-Slapjanus",
    exp: 50,
  },
  {
    rank: "Slapjanus",
    exp: 150,
  },
  {
    rank: "Vreselijke Amateur",
    exp: 300,
  },
  {
    rank: "Amateur",
    exp: 500,
  },
  {
    rank: "Normaal",
    exp: 800,
  },
  {
    rank: "Judoka",
    exp: 1200,
  },
  {
    rank: "Redelijk sterk",
    exp: 1800,
  },
  {
    rank: "Bokser",
    exp: 2800,
  },
  {
    rank: "Sterk",
    exp: 4000,
  },
  {
    rank: "Kickbokser",
    exp: 5600,
  },
  {
    rank: "Super sterk",
    exp: 7000,
  },
  {
    rank: "Machtig",
    exp: 9000,
  },
  {
    rank: "Erg machtig",
    exp: 11000,
  },
  {
    rank: "Super machtig",
    exp: 14000,
  },
  {
    rank: "Ultra deluxe machtig",
    exp: 17000,
  },
  {
    rank: "Onmenselijk sterk",
    exp: 20000,
  },
  {
    rank: "Robotachtig sterk",
    exp: 25000,
  },
  {
    rank: "Goddelijk",
    exp: 30000,
  },
  {
    rank: "Erg goddelijk",
    exp: 35000,
  },
  {
    rank: "Super goddelijk",
    exp: 40000,
  },
  {
    rank: "Ultra deluxe goddelijk",
    exp: 45000,
  },
  {
    rank: "Beter dan Allah",
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
  needCaptcha,
  publicUserFields,
};
