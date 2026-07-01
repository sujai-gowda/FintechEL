const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    currency: { type: String, default: 'INR' },
    balance: { type: Number, default: 0 },
    pinHash: { type: String, default: null },
    hasPin: { type: Boolean, default: false },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.model('Wallet', walletSchema);
