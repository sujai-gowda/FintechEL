const bcrypt = require('bcryptjs');
const Wallet = require('../models/Wallet');

const verifyWalletPin = async (userId, pin) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || !wallet.hasPin) {
    return { ok: false, error: 'Set up wallet PIN first' };
  }
  const valid = await bcrypt.compare(pin, wallet.pinHash);
  if (!valid) return { ok: false, error: 'Invalid PIN' };
  return { ok: true, wallet };
};

module.exports = { verifyWalletPin };
