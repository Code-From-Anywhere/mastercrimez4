const cars = require("../assets/cars.json");
const { getTextFunction } = require("./util");

let getText = getTextFunction();

const showroom = async (req, res, User, Garage) => {
  res.json(
    cars.map(({ id, naam, url, waarde, kogels }) => ({
      id,
      naam,
      url,
      waarde: waarde * 3,
    }))
  );
};

const buycar = async (req, res, User, Garage) => {
  const { id, loginToken } = req.body;
  const user = await User.findOne({ where: { loginToken } });
  if (user) {
    getText = getTextFunction(user.locale);

    const car = cars.find((car1) => Number(car1.id) === Number(id));
    if (car) {
      if (user.cash >= Number(car.waarde) * 3) {
        User.update(
          { cash: user.cash - Number(car.waarde) * 3 },
          { where: { id: user.id } }
        );

        const created = await Garage.create({
          userId: user.id,
          date: Date.now(),
          auto: car.naam,
          image: car.url,
          cash: car.waarde,
          power: 0,
          kogels: car.kogels,
        });

        res.json({ response: getText("showroomSuccess") });
      } else {
        res.json({ response: getText("showroomNotEnoughCash") });
      }
    } else {
      res.json({ response: getText("showroomCarDoesntExist") });
    }
  } else {
    res.json({ response: getText("invalidUser") });
  }
};

module.exports = { showroom, buycar };
