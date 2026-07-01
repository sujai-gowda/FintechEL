const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');

const createTransaction = async (from, to, amount, currency, type, relatedId = null) => {
  return Transaction.create({
    transactionId: uuidv4(),
    from,
    to,
    amount: Number(amount),
    currency: currency || 'INR',
    type,
    relatedId,
  });
};

module.exports = { createTransaction };
