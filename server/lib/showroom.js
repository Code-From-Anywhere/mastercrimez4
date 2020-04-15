const cars = require("../assets/cars.json");

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

        res.json({ response: "Gekocht" });
      } else {
        res.json({ response: "Je hebt niet genoeg geld contant" });
      }
    } else {
      res.json({ response: "Deze auto bestaat niet" });
    }
  } else {
    res.json({ response: "Kan deze gebruiker niet vinden" });
  }
};

module.exports = { showroom, buycar };
