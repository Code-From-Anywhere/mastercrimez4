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
      `SELECT auto, COUNT(*) as amount from garages WHERE userId='${user.id}' GROUP BY auto`
    );

    res.json(grouped);
  } else {
    res.json({ error: "no user found" });
  }
};

const sellcar = async (req, res, User, Garage) => {
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
          { cash: user.cash + Number(car.cash) },
          { where: { id: user.id } }
        );

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

const crushcar = async (req, res, User, Garage) => {
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

const upgradecar = async (req, res, User, Garage) => {
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

  const price = (car.power + 1) * 1000000;

  if (user.cash < price) {
    res.json({ response: "Je hebt niet genoeg geld contant" });
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
};
