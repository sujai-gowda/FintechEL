const Transaction = require('../models/Transaction');

const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.user.id }, { to: req.user.id }],
    }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    const { readJSONFile } = require('../utils/storage');
    const transactions = readJSONFile('transactions');
    const myTxs = transactions.filter((t) => t.from === req.user.id || t.to === req.user.id);
    res.json(myTxs);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.json(require('../utils/storage').readJSONFile('transactions'));
  }
};

const getMyNotifications = (req, res) => {
  res.json([]);
};

module.exports = {
  getMyTransactions,
  getAllTransactions,
  getMyNotifications,
};
