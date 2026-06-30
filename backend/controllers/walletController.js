const { readJSONFile, updateJSONFile, addJSONRecord } = require('../utils/storage');
const { v4: uuidv4 } = require('uuid');

const getWallets = (req, res) => {
  const wallets = readJSONFile('wallets');
  res.json(wallets);
};

const getMyWallet = (req, res) => {
  const wallets = readJSONFile('wallets');
  let myWallet = wallets.find(w => w.userId === req.user.id);
  
  // If user doesn't have a wallet yet, create one with 0 balance
  if (!myWallet) {
    myWallet = {
      id: uuidv4(),
      userId: req.user.id,
      currency: 'USD',
      balance: 0
    };
    addJSONRecord('wallets', myWallet);
  }

  res.json(myWallet);
};

const assignBalance = (req, res) => {
  const { userId, currency, amount } = req.body;

  if (!userId || !currency || amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const wallets = readJSONFile('wallets');
  let wallet = wallets.find(w => w.userId === userId);

  if (wallet) {
    updateJSONFile('wallets', wallet.id, { currency, balance: Number(amount) });
    wallet = { ...wallet, currency, balance: Number(amount) };
  } else {
    wallet = {
      id: uuidv4(),
      userId,
      currency,
      balance: Number(amount)
    };
    addJSONRecord('wallets', wallet);
  }

  res.json({ message: 'Balance assigned successfully', wallet });
};

module.exports = {
  getWallets,
  getMyWallet,
  assignBalance
};
