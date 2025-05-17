const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.getFlaggedTransactions = async (req, res) => {
  try {
    const flagged = await Transaction.find({ flagged: true }).sort({ timestamp: -1 });
    res.json(flagged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBalanceSummary = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { is_deleted: false } },
      { $group: { _id: null, totalBalance: { $sum: "$balance" } } }
    ]);
    res.json({ totalBalance: result[0]?.totalBalance || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const top = await User.find({ role: 'user' })
      .sort({ balance: -1 })
      .limit(5)
      .select('name email balance account_number');

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.undoDelete = async (req, res) => {
  const {account_number} = req.body;
  try{
    const user = await User.findOne({account_number})
    if(user.is_deleted === true) user.is_deleted = false;
    await user.save();
    return res.status(201).json({message : 'Account reactivated'});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};