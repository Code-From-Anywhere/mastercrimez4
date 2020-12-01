const gamestats = async (req, res, Stat) => {
  const stats = await Stat.findAll({ order: [["id", "DESC"]], limit: 30 * 24 });
  res.json({ stats: stats.reverse() });
};

module.exports = { gamestats };
