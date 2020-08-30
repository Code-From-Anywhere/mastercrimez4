/*
Hand				Frequency		Probability		freq som
(Royal flush)		4,324			0.0032%			4324
Straight flush		41,584			0.0311%			45908
Four of a kind		224,848			0.168%			270756
Full house			3,473,184		2.60%			3743940
Flush				4,047,644		3.03%			7791584
Straight			6,180,020		4.62%			13971604
Three of a kind		6,461,620		4.83%			20433224
Two pair			31,433,400		23.5%			51866624
One pair			58,627,800		43.8%			110494424
No pair				23,294,460		17.4%			133788884
Total				133,784,560		100%			--

*/

const strings = {
  royalFlush: "Royal Flush", //3125,
  straightFlush: "Straight Flush", //321
  fourOfAKind: "Four of a Kind",
  fullHouse: "Full House",
  flush: "Flush",
  straight: "Straat",
  threeOfAKind: "Three of a Kind",
  twoPair: "Two pair",
  onePair: "One pair",
  highCard: "High Card",
};

const payouts = {
  royalFlush: 300, //3125,
  straightFlush: 100, //321
  fourOfAKind: 40,
  fullHouse: 7,
  flush: 5,
  straight: 4,
  threeOfAKind: 2,
  twoPair: 1,
  onePair: 0,
  highCard: 0,
}; //this gives an avarage ROI of -0.17%. so the casino can earn 1/1000th of your buyin

const possibilities = {
  // royalFlush: 0.999823,
  royalFlush: 0.999791,
  straightFlush: 0.99948,
  fourOfAKind: 0.9978,
  fullHouse: 0.9781,
  flush: 0.9415,
  straight: 0.8953,
  threeOfAKind: 0.847,
  twoPair: 0.612,
  onePair: 0.174,
  highCard: 0,
};

const { Op, Sequelize } = require("sequelize");

const poker = async (req, res, User, City, Action) => {
  const { loginToken, amount } = req.body;

  if (!loginToken) {
    return res.json({ response: "Geen token gegeven" });
  }

  if (amount <= 0 || isNaN(amount)) {
    res.json({ response: "Ongeldige hoeveelheid" });
    return;
  }

  const user = await User.findOne({ where: { loginToken } });

  if (!user) {
    return res.json({ response: "Geen user gevonden" });
  }

  if (user.jailAt > Date.now()) {
    return res.json({ response: "Je zit in de bajes." });
  }

  if (user.health === 0) {
    return res.json({ response: "Je bent dood." });
  }

  if (user.reizenAt > Date.now()) {
    return res.json({ response: "Je bent aan het reizen." });
  }

  if (user.cash < amount) {
    return res.json({ response: "Je hebt niet genoeg geld contant" });
  }

  const [updated] = await User.update(
    { cash: user.cash - amount },
    { where: { id: user.id, cash: { [Op.gte]: amount } } }
  );

  if (updated !== 1) {
    return res.json({ response: "Je hebt niet genoeg geld contant" });
  }

  City.update(
    {
      casinoProfit: Sequelize.literal(
        `casinoProfit+${Math.floor(amount * 0.001)}`
      ),
    },
    { where: { city: user.city } }
  );

  const random = Math.random(); //[0-1]
  const windex = Object.values(possibilities).findIndex((x) => random >= x);
  const winner = Object.keys(possibilities)[windex];

  const payout = Object.values(payouts)[windex];

  User.update(
    {
      cash: Sequelize.literal(`cash + ${payout * amount}`),
      onlineAt: Date.now(),
    },
    { where: { id: user.id } }
  );

  Action.create({
    userId: user.id,
    action: "poker",
    timestamp: Date.now(),
  });

  winnerString = strings[winner];

  res.json({
    response: `Je had een ${winnerString} en verdient ${payout}x je inzet terug: €${
      payout * amount
    },-`,
  });
};

module.exports = { poker };
