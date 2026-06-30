const { addJSONRecord } = require('./storage');
const { v4: uuidv4 } = require('uuid');

const createTransaction = (from, to, amount, currency, type, relatedId = null) => {
  const transaction = {
    transactionId: uuidv4(),
    from, // userId or 'escrow' or 'system'
    to,   // userId or 'escrow' or 'system'
    amount: Number(amount),
    currency,
    type, // ESCROW_FUND, PAYMENT_RELEASE, REFUND, DISPUTE_CREATED, ADMIN_RELEASE
    relatedId
  };
  
  return addJSONRecord('transactions', transaction);
};

module.exports = {
  createTransaction
};
