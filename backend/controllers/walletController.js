const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Wallet = require('../models/Wallet');
const { createTransaction } = require('../utils/transaction');

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({
      id: uuidv4(),
      userId,
      currency: 'INR',
      balance: 0,
      hasPin: false,
    });
  }
  return wallet;
};

const getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
};

const getMyWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user.id);
    res.json({
      id: wallet.id,
      userId: wallet.userId,
      currency: wallet.currency,
      balance: wallet.balance,
      hasPin: wallet.hasPin,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

const setupPin = async (req, res) => {
  try {
    const { pin, confirmPin } = req.body;
    if (!pin || pin.length !== 4) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }
    if (pin !== confirmPin) {
      return res.status(400).json({ error: 'PINs do not match' });
    }

    const wallet = await getOrCreateWallet(req.user.id);
    wallet.pinHash = await bcrypt.hash(pin, 10);
    wallet.hasPin = true;
    await wallet.save();

    res.json({ message: 'Wallet PIN set successfully', hasPin: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup PIN' });
  }
};

const addMoney = async (req, res) => {
  try {
    const { amount, pin, method } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Enter a valid amount' });
    }
    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' });
    }

    const wallet = await getOrCreateWallet(req.user.id);
    if (!wallet.hasPin) {
      return res.status(400).json({ error: 'Set up wallet PIN first' });
    }

    const pinValid = await bcrypt.compare(pin, wallet.pinHash);
    if (!pinValid) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    wallet.balance += numAmount;
    await wallet.save();

    await createTransaction('system', req.user.id, numAmount, 'INR', `WALLET_TOPUP_${method || 'UPI'}`);

    res.json({
      message: `₹${numAmount.toLocaleString('en-IN')} added successfully via ${method || 'UPI'}`,
      wallet: { balance: wallet.balance, currency: wallet.currency },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add money' });
  }
};

const assignBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wallet = await getOrCreateWallet(userId);
    wallet.balance = Number(amount);
    wallet.currency = 'INR';
    await wallet.save();

    res.json({ message: 'Balance assigned successfully', wallet });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign balance' });
  }
};

module.exports = {
  getWallets,
  getMyWallet,
  setupPin,
  addMoney,
  assignBalance,
};
