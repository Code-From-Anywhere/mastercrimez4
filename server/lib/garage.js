const { Op } = require("sequelize");
const cars = require("../assets/cars.json");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const garage = async (req, res, User, Garage) => {
  const { token, auto } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }
  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    //find all future activities within square, add distance, filter distance, add its user
    Garage.findAll({
      where: {
        userId: user.id,
        power: 0,
      },
    }).then(async (garage) => {
      res.json(garage);
    });
  } else {
    res.json({ error: getText("invalidUser") });
  }
};

const racecars = async (req, res, User, Garage) => {
  const { token, auto } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }
  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    //find all future activities within square, add distance, filter distance, add its user
    Garage.findAll({
      where: {
        userId: user.id,
        power: { [Op.gt]: 0 },
      },
    }).then(async (garage) => {
      res.json(garage);
    });
  } else {
    res.json({ error: getText("invalidUser") });
  }
};

const garageGrouped = async (req, res, User, Garage, sequelize) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    //find all future activities within square, add distance, filter distance, add its user
    const [grouped, meta] = await sequelize.query(
      `SELECT id,auto, COUNT(*) as amount, image, cash, power, kogels from garages WHERE userId='${user.id}' AND power=0 GROUP BY garages.auto ORDER BY amount DESC`
    );

    res.json(grouped);
  } else {
    res.json({ error: getText("invalidUser") });
  }
};

const sellcar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    getText = getTextFunction(user.locale);

    const car = await Garage.findOne({ where: { id, userId: user.id } });
    if (car) {
      const destroy = await car.destroy();

      if (destroy) {
        User.update(
          { cash: user.cash + Number(car.cash), onlineAt: Date.now() },
          { where: { id: user.id } }
        );

        Action.create({
          userId: user.id,
          action: "sellcar",
          timestamp: Date.now(),
        });

        res.json({ response: getText("sellSuccess") });
      } else {
        res.json({ response: getText("couldntDeleteCar") });
      }
    } else {
      res.json({ response: getText("carDoesntExist") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

const bulkaction = async (req, res, User, Garage, Action) => {
  const { auto, loginToken, amount, action } = req.body;

  if (!action) {
    res.json({ response: getText("noAction") });
    return;
  }

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  if (!amount || amount < 1) {
    res.json({ response: getText("giveAmount") });
    return;
  }

  if (!auto) {
    res.json({ response: getText("invalidCar") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  const cars = await Garage.findAll({
    where: { auto, userId: user.id, power: 0 },
  });
  if (!cars) {
    res.json({ response: getText("invalidCar") });
    return;
  }

  if (amount > cars.length || amount < 0 || isNaN(amount)) {
    res.json({ response: getText("youDontHaveSoMany") });
    return;
  }

  let profit = 0;

  cars.forEach(async (car, index) => {
    if (index < amount) {
      const what = action === "sell" ? "cash" : "kogels";
      profit += Number(car[what]);
      const destroy = await car.destroy();
    }
  });

  const what = action === "sell" ? "cash" : "bullets";

  const [updated] = await User.update(
    { [what]: user[what] + profit },
    { where: { id: user.id } }
  );

  if (updated) {
    Action.create({
      userId: user.id,
      action: "garage_bulkAction",
      timestamp: Date.now(),
    });

    res.json({ response: getText("success") });
  } else {
    res.json({ response: getText("somethingWentWrong") });
  }
};

const crushcar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    getText = getTextFunction(user.locale);

    const car = await Garage.findOne({ where: { id, userId: user.id } });
    if (car) {
      const destroy = await car.destroy();

      if (destroy) {
        User.update(
          { bullets: user.bullets + car.kogels },
          { where: { id: user.id } }
        );

        Action.create({
          userId: user.id,
          action: "crushCar",
          timestamp: Date.now(),
        });

        res.json({ response: getText("crushSuccess") });
      } else {
        res.json({ response: getText("couldntDeleteCar") });
      }
    } else {
      res.json({ response: getText("carDoesntExist") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

const upgradecar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

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

  const car = await Garage.findOne({ where: { id, userId: user.id } });
  if (!car) {
    res.json({ response: getText("carDoesntExist") });
    return;
  }

  const price = (car.power + 1) * 200000;

  if (user.cash < price) {
    res.json({
      response: getText("notEnoughCash", price),
    });
    return;
  }

  const dbCar = cars.find((c) => c.naam === car.auto);

  if (!dbCar) {
    res.json({ response: getText("invalidDbCar") });
    return;
  }

  if (car.power >= dbCar.maxpower) {
    res.json({ response: getText("carReachedMaxPower") });
    return;
  }

  Action.create({
    userId: user.id,
    action: "upgradeCar",
    timestamp: Date.now(),
  });

  User.update({ cash: user.cash - Number(price) }, { where: { id: user.id } });
  Garage.update({ power: car.power + 1 }, { where: { id: car.id } });

  res.json({ response: getText("upgradeSuccess") });
};

module.exports = {
  garage,
  upgradecar,
  racecars,
  garageGrouped,
  sellcar,
  crushcar,
  bulkaction,
};
