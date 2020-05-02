const { Sequelize } = require("sequelize");
const { getRank } = require("./util");

const RANK_GODFATHER = 11;
const RANK_UNLIMITED_DON = 16;

const setAccomplice = async (req, res, User) => {
  const {
    accomplice,
    accomplice2,
    accomplice3,
    accomplice4,
    loginToken,
  } = req.body;

  if (!loginToken) {
    res.json({ response: "Give a token" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    res.json({ response: "Invalid user" });
    return;
  }

  const rank = getRank(user.rank, "number");

  let update = {};

  if (accomplice !== undefined) {
    const accompliceUser = await User.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", accomplice)
        ),
      },
    });

    if (
      accompliceUser &&
      accompliceUser.name !== user.name &&
      accompliceUser.name !== user.accomplice2 &&
      accompliceUser.name !== user.accomplice3 &&
      accompliceUser.name !== user.accomplice4
    ) {
      update.accomplice = accompliceUser.name;
    } else {
      res.json({ response: "Ongeldige naam" });
      return;
    }
  }

  if (accomplice2) {
    if (rank < RANK_GODFATHER) {
      res.json({ response: "Je rang is niet hoog genoeg" });
      return;
    }

    const accompliceUser = await User.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", accomplice2)
        ),
      },
    });

    if (
      accompliceUser &&
      accompliceUser.name !== user.name &&
      accompliceUser.name !== user.accomplice &&
      accompliceUser.name !== user.accomplice3 &&
      accompliceUser.name !== user.accomplice4
    ) {
      update.accomplice2 = accompliceUser.name;
    } else {
      res.json({ response: "Ongeldige naam" });
      return;
    }
  }

  if (accomplice3) {
    if (rank < RANK_UNLIMITED_DON) {
      res.json({ response: "Je rang is niet hoog genoeg" });
      return;
    }
    const accompliceUser = await User.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", accomplice3)
        ),
      },
    });

    if (
      accompliceUser &&
      accompliceUser.name !== user.name &&
      accompliceUser.name !== user.accomplice &&
      accompliceUser.name !== user.accomplice2 &&
      accompliceUser.name !== user.accomplice4
    ) {
      update.accomplice3 = accompliceUser.name;
    } else {
      res.json({ response: "Ongeldige naam" });
      return;
    }
  }

  if (accomplice4) {
    if (rank < RANK_UNLIMITED_DON) {
      res.json({ response: "Je rang is niet hoog genoeg" });
      return;
    }
    const accompliceUser = await User.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", accomplice4)
        ),
      },
    });

    if (
      accompliceUser &&
      accompliceUser.name !== user.name &&
      accompliceUser.name !== user.accomplice &&
      accompliceUser.name !== user.accomplice2 &&
      accompliceUser.name !== user.accomplice3
    ) {
      update.accomplice4 = accompliceUser.name;
    } else {
      res.json({ response: "Ongeldige naam" });
      return;
    }
  }

  const updated = await User.update(update, { where: { loginToken } });
  console.log(updated);
  res.json({ response: "Gelukt" });
};

module.exports = { setAccomplice };
