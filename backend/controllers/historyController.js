const { readJSONFile } = require('../utils/storage');

const getMyTransactions = (req, res) => {
  const transactions = readJSONFile('transactions');
  const myTxs = transactions.filter(t => t.from === req.user.id || t.to === req.user.id);
  res.json(myTxs);
};

const getAllTransactions = (req, res) => {
  const transactions = readJSONFile('transactions');
  res.json(transactions);
};

const getMyNotifications = (req, res) => {
  const notifications = readJSONFile('notifications');
  const myNotifs = notifications.filter(n => n.userId === req.user.id);
  res.json(myNotifs);
};

module.exports = {
  getMyTransactions,
  getAllTransactions,
  getMyNotifications
};
