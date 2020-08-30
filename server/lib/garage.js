const { Op } = require("sequelize");
const cars = require("../assets/cars.json");

const garage = async (req, res, User, Garage) => {
  const { token, auto } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
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
    res.json({ error: "no user found" });
  }
};

const racecars = async (req, res, User, Garage) => {
  const { token, auto } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
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
    res.json({ error: "no user found" });
  }
};

const garageGrouped = async (req, res, User, Garage, sequelize) => {
  const { token } = req.query;

  if (!token) {
    res.json({ response: "No token given" });
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
    res.json({ error: "no user found" });
  }
};

const sellcar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: "No token given" });
    return;
  }
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
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

        res.json({ response: "Verkocht" });
      } else {
        res.json({ response: "Kon auto niet verwijderen" });
      }
    } else {
      res.json({ response: "Deze auto bestaat niet" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

const bulkaction = async (req, res, User, Garage, Action) => {
  const { auto, loginToken, amount, action } = req.body;

  if (!action) {
    res.json({ response: "No action given" });
    return;
  }

  if (!loginToken) {
    res.json({ response: "No token given" });
    return;
  }

  if (!amount || amount < 1) {
    res.json({ response: "Geef een aantal op" });
    return;
  }

  if (!auto) {
    res.json({ response: "Ongeldige auto" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    res.json({ response: "User niet gevonden" });
    return;
  }

  const cars = await Garage.findAll({
    where: { auto, userId: user.id, power: 0 },
  });
  if (!cars) {
    res.json({ response: "Ongeldige auto" });
    return;
  }

  if (amount > cars.length || amount < 0 || isNaN(amount)) {
    res.json({ response: "Zoveel heb je er niet!" });
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

    res.json({ response: "Gelukt" });
  } else {
    res.json({ response: "Er ging iets fout" });
  }
};

const crushcar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: "No token given" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });
  if (user) {
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

        res.json({ response: "Gecrushed" });
      } else {
        res.json({ response: "Kon auto niet verwijderen" });
      }
    } else {
      res.json({ response: "Deze auto bestaat niet" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

const upgradecar = async (req, res, User, Garage, Action) => {
  const { id, loginToken } = req.body;

  if (!loginToken) {
    res.json({ response: "No token given" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });
  if (!user) {
    res.json({ response: "Kan deze gebruiker niet vinden" });
    return;
  }

  const car = await Garage.findOne({ where: { id, userId: user.id } });
  if (!car) {
    res.json({ response: "Deze auto bestaat niet" });
    return;
  }

  const price = (car.power + 1) * 200000;

  if (user.cash < price) {
    res.json({
      response: `Je hebt niet genoeg geld contant, het kost €${price},-`,
    });
    return;
  }

  const dbCar = cars.find((c) => c.naam === car.auto);

  if (!dbCar) {
    res.json({ response: "Deze auto kan niet langer geupgrade worden" });
    return;
  }

  if (car.power >= dbCar.maxpower) {
    res.json({ response: "Deze auto heeft het maximale level bereikt" });
    return;
  }

  Action.create({
    userId: user.id,
    action: "upgradeCar",
    timestamp: Date.now(),
  });

  User.update({ cash: user.cash - Number(price) }, { where: { id: user.id } });
  Garage.update({ power: car.power + 1 }, { where: { id: car.id } });

  res.json({ response: "Geupgrade" });
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
