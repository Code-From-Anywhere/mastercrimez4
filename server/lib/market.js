const { Op, Sequelize } = require("sequelize");
const {
  getTextFunction,
  sendChatPushMail,
  publicUserFields,
  saveImageIfValid,
  getRank,
  ranks,
  strengthRanks,
  getStrength,
} = require("./util");
const moment = require("moment");
let getText = getTextFunction();
const releaseDate = moment("15/12/2020", "DD/MM/YYYY").set("hours", 17);

const removeOffer = async ({ id, Offer, User }) => {
  const offer = await Offer.findOne({ where: { id } });

  if (offer) {
    const destroyed = await Offer.destroy({ where: { id } });
    if (offer.isBuy) {
      const [updated] = await User.update(
        { cash: Sequelize.literal(`cash + ${offer.price}`) },
        { where: { id: offer.userId } }
      );
    } else {
      const [updated] = await User.update(
        { [offer.type]: Sequelize.literal(`${offer.type} + ${offer.amount}`) },
        { where: { id: offer.userId } }
      );
    }
  }
};

const marketCreateOffer = async (
  req,
  res,
  { Offer, User, Action, Channel, ChannelSub, ChannelMessage, City }
) => {
  const { token, type, amount, price, buy } = req.body;

  const validTypes = ["junkies", "hoeren", "wiet", "gamepoints", "bullets"];

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  if (!user.phoneVerified) {
    //NB: Verify instantly here because you can otherwise send stuff to your main
    return res.json({ response: getText("accountNotVerified") });
  }

  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (
    !type ||
    !amount ||
    !price ||
    isNaN(amount) ||
    isNaN(price) ||
    !validTypes.includes(type) ||
    amount < 1 ||
    price < 1 ||
    (buy !== true && buy !== false)
  ) {
    return res.json({ response: getText("invalidValues") });
  }

  const thePrice = Math.round(Number(price));
  const theAmount = Math.round(Number(amount));
  const typeString = getText(type);

  if (buy) {
    if (user.cash < thePrice) {
      return res.json({ response: getText("notEnoughCash", price) });
    }

    const [updated] = await User.update(
      { cash: Sequelize.literal(`cash - ${thePrice}`) },
      { where: { id: user.id, cash: { [Op.gte]: thePrice } } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }
  } else {
    if (user[type] < theAmount) {
      return res.json({ response: getText("notEnough") });
    }

    const [updated] = await User.update(
      { [type]: Sequelize.literal(`${type} - ${theAmount}`) },
      { where: { id: user.id, [type]: { [Op.gte]: theAmount } } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }
  }

  const profitMarket = buy ? Math.round(thePrice * 0.025) : 0;
  City.update(
    { marketProfit: Sequelize.literal(`marketProfit+${profitMarket}`) },
    { where: { city: user.city, marketOwner: { [Op.ne]: null } } }
  );

  Offer.create({
    userId: user.id,
    type,
    amount: buy ? theAmount : Math.round(theAmount * 0.95),
    price: buy ? Math.round(thePrice * 0.95) : thePrice,
    isBuy: buy,
  });

  const requestOrOfferString = buy
    ? getText("requestPast")
    : getText("offerPast");

  Action.create({
    userId: user.id,
    action: "offerCreate",
    timestamp: Date.now(),
  });

  res.json({
    response: getText(
      "marketCreateOfferSuccess",

      theAmount,
      typeString,
      requestOrOfferString,
      thePrice
    ),
  });
};

const marketTransaction = async (
  req,
  res,
  { Offer, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, offerId } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (!offerId) {
    return res.json({ response: getText("invalidValues") });
  }

  const offer = await Offer.findOne({
    where: { id: offerId },
    include: { model: User },
  });

  if (!offer) {
    return res.json({ response: getText("couldntFindOffer") });
  }

  if (offer.userId === user.id) {
    return res.json({ response: getText("cantBuyFromYourself") });
  }
  const typeString = getText(offer.type);

  if (!offer.isBuy) {
    //offer is a sale. user is buying something
    if (user.cash < offer.price) {
      return res.json({ response: getText("notEnoughCash", offer.price) });
    }

    const [updated] = await User.update(
      { cash: Sequelize.literal(`cash - ${offer.price}`) },
      { where: { id: user.id, cash: { [Op.gte]: offer.price } } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }

    const destroyed = await Offer.destroy({ where: { id: offer.id } });

    console.log("destroyed", destroyed);
    if (destroyed) {
      await User.update(
        { [offer.type]: Sequelize.literal(`${offer.type} + ${offer.amount}`) },
        { where: { id: user.id } }
      );

      const [givenMoneyToOfferer] = await User.update(
        { bank: Sequelize.literal(`bank + ${offer.price}`) },
        { where: { id: offer.userId } }
      );
    }
  } else {
    //user is buying something
    if (user[offer.type] < offer.amount) {
      return res.json({ response: getText("notEnough") });
    }

    const [updated] = await User.update(
      { [offer.type]: Sequelize.literal(`${offer.type} - ${offer.amount}`) },
      { where: { id: user.id, [offer.type]: { [Op.gte]: offer.amount } } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }

    const destroyed = await Offer.destroy({ where: { id: offer.id } });

    if (destroyed) {
      await User.update(
        { cash: Sequelize.literal(`cash + ${offer.price}`) },
        { where: { id: user.id } }
      );

      const [giveWhatToOfferer] = await User.update(
        { [offer.type]: Sequelize.literal(`${offer.type} + ${offer.amount}`) },
        { where: { id: offer.userId } }
      );
    } else {
      console.log("not destroyed", destroyed);
    }
  }

  const requestOrOfferString = offer.isBuy
    ? getText("sold")
    : getText("bought");

  Action.create({
    userId: user.id,
    action: "offerTransaction",
    timestamp: Date.now(),
  });

  sendChatPushMail({
    Channel,
    ChannelMessage,
    ChannelSub,
    User,
    isSystem: true,
    message: getText(
      "marketTransactionMessage",
      user.name,
      offer.amount,
      typeString,
      requestOrOfferString,
      offer.price
    ),
    user1: user,
    user2: offer.user,
  });

  res.json({
    response: getText(
      "marketTransactionSuccess",
      offer.amount,
      typeString,
      requestOrOfferString,
      offer.price,
      offer.user && offer.user.name
    ),
  });
};

const marketRemoveOffer = async (
  req,
  res,
  { Offer, User, Action, Channel, ChannelSub, ChannelMessage }
) => {
  const { token, offerId } = req.body;

  if (!token) {
    res.json({ response: getText("noToken") });
    return;
  }

  const user = await User.findOne({ where: { loginToken: token } });

  if (!user) {
    res.json({ response: getText("invalidUser") });
    return;
  }

  getText = getTextFunction(user.locale);

  if (user.level < 2 && moment().isBefore(releaseDate)) {
    return res.json({ response: getText("noAccess") });
  }

  if (!offerId) {
    return res.json({ response: getText("invalidValues") });
  }

  const offer = await Offer.findOne({
    where: { id: offerId },
    include: { model: User },
  });

  if (!offer) {
    return res.json({ response: getText("couldntFindOffer") });
  }

  if (offer.userId !== user.id) {
    return res.json({ response: getText("invalidOffer") });
  }

  const destroyed = await Offer.destroy({ where: { id: offer.id } });

  if (!destroyed) {
    return res.json({ response: "invalidOffer" });
  }

  if (offer.isBuy) {
    const [updated] = await User.update(
      { cash: Sequelize.literal(`cash + ${offer.price}`) },
      { where: { id: user.id } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }
  } else {
    const [updated] = await User.update(
      { [offer.type]: Sequelize.literal(`${offer.type} + ${offer.amount}`) },
      { where: { id: user.id } }
    );

    if (updated !== 1) {
      return res.json({ response: getText("couldntUpdateUser") });
    }
  }

  Action.create({
    userId: user.id,
    action: "offerRemove",
    timestamp: Date.now(),
  });

  const requestOrOfferString = offer.isBuy
    ? getText("request")
    : getText("offer");

  res.json({
    response: getText("removed", requestOrOfferString),
  });
};

const market = async (req, res, { Offer, User }) => {
  const market = await Offer.findAll({
    include: { model: User, attributes: publicUserFields },
  });
  res.json({ market });
};

module.exports = {
  removeOffer,
  //post
  marketCreateOffer,
  marketTransaction,
  marketRemoveOffer,
  //get
  market,
};
