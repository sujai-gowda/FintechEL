const { v4: uuidv4 } = require('uuid');
const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');
const { createTransaction } = require('./transaction');

const lockFundsInEscrow = async ({ posterId, jobId, amount, freelancerId = null }) => {
  const escrow = await Escrow.create({
    escrowId: uuidv4(),
    jobId,
    jobPosterId: posterId,
    freelancerId,
    amount,
    currency: 'INR',
    status: 'HELD',
  });

  await createTransaction(posterId, 'escrow', amount, 'INR', 'ESCROW_FUND', escrow.escrowId);
  return escrow;
};

const getActiveEscrowForJob = async (jobId) => {
  return Escrow.findOne({
    jobId,
    status: { $in: ['HELD', 'SUBMITTED', 'DISPUTED'] },
  });
};

const refundEscrowToPoster = async (escrow, posterWallet) => {
  posterWallet.balance += escrow.amount;
  await posterWallet.save();
  escrow.status = 'REFUNDED';
  await escrow.save();
  await createTransaction('escrow', escrow.jobPosterId, escrow.amount, escrow.currency, 'REFUND', escrow.escrowId);
};

const releaseEscrowToFreelancer = async (escrow) => {
  let freelancerWallet = await Wallet.findOne({ userId: escrow.freelancerId });
  if (!freelancerWallet) {
    freelancerWallet = await Wallet.create({
      id: uuidv4(),
      userId: escrow.freelancerId,
      currency: 'INR',
      balance: 0,
    });
  }

  freelancerWallet.balance += escrow.amount;
  await freelancerWallet.save();

  escrow.status = 'RELEASED';
  await escrow.save();

  await createTransaction('escrow', escrow.freelancerId, escrow.amount, escrow.currency, 'PAYMENT_RELEASE', escrow.escrowId);
};

module.exports = {
  lockFundsInEscrow,
  getActiveEscrowForJob,
  refundEscrowToPoster,
  releaseEscrowToFreelancer,
};
