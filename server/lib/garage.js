const garage = async (req, res, User, Garage) => {
  const { token } = req.query;

  const user = await User.findOne({ where: { loginToken: token } });

  if (user) {
    //find all future activities within square, add distance, filter distance, add its user
    Garage.findAll({
      where: {
        userId: user.id
      }
    }).then(async garage => {
      res.json(garage);
    });
  } else {
    res.json({ error: "no user found" });
  }
};

const sellcar = async (req, res, User, Garage) => {
  const { id, loginToken } = req.body;
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

//upgradecar

module.exports = { garage, sellcar, crushcar };
