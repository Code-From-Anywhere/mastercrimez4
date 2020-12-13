const getPrize = (position, totalPositions, totalAmount) => {
  //1 = 100%
  //2 = 60/40
  //3 = 50/30/20
  //10 = 20/15/8/8/8/...

  const positionsArray = [];
  let pos = totalPositions;
  while (pos--) positionsArray.push(totalPositions - pos);

  const factorLess = 0.7;

  //0.7^(positie-1)/sum(0.7^positie-1) * T
  const prize =
    (Math.pow(factorLess, position - 1) /
      positionsArray.reduce(
        (previous, pos) => previous + Math.pow(factorLess, pos - 1),
        0
      )) *
    totalAmount;

  const decimals = Math.round(prize).toString().length;
  const base = Math.pow(10, decimals - 1);

  return Math.round(prize / base) * base;
};

const prizes = async (req, res, { Prize, User, Gang }) => {
  let prizes = await Prize.findAll({});
  prizes = await Promise.all(
    prizes.map(async (prize) => {
      let stats;

      if (prize.forWhat === "gang") {
        stats = await Gang.findAll({
          order: [["score", "DESC"]],
          limit: prize.amountPrizes,
          attributes: ["id", "name", "score", "thumbnail"],
        });
        stats.map((stat, index) => {
          stat.dataValues.prize = getPrize(
            index + 1,
            prize.amountPrizes,
            prize.prizeAmount
          );
          return stat;
        });
      } else {
        stats = await User.findAll({
          order: [[prize.forWhat, "DESC"]],
          limit: prize.amountPrizes,
          attributes: publicUserFields,
        });

        stats.map((stat, index) => {
          stat.dataValues.prize = getPrize(
            index + 1,
            prize.amountPrizes,
            prize.prizeAmount
          );
          return stat;
        });
      }

      prize.dataValues.stats = stats;

      return prize;
    })
  );

  res.json({
    prizes,
  });
};

module.exports = {
  prizes,
  getPrize,
};
