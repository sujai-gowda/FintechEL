const { readJSONFile, writeJSONFile, updateJSONFile, addJSONRecord } = require('../utils/storage');
const { createTransaction } = require('../utils/transaction');
const { v4: uuidv4 } = require('uuid');

const raiseDispute = (req, res) => {
  const { escrowId, reason } = req.body;
  const escrows = readJSONFile('escrows');
  const escrow = escrows.find(e => e.escrowId === escrowId);

  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.jobPosterId !== req.user.id && escrow.freelancerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized for this escrow' });
  }

  updateJSONFile('escrows', escrowId, { status: 'DISPUTED' });

  const dispute = {
    disputeId: uuidv4(),
    escrowId,
    raisedBy: req.user.id,
    reason,
    status: 'OPEN'
  };

  addJSONRecord('disputes', dispute);
  createTransaction(req.user.id, 'system', 0, escrow.currency, 'DISPUTE_CREATED', escrow.escrowId);

  res.json({ message: 'Dispute raised successfully', dispute });
};

const resolveDispute = (req, res) => {
  const { disputeId, resolution, winnerId } = req.body; // winnerId is either posterId or freelancerId
  
  const disputes = readJSONFile('disputes');
  const dispute = disputes.find(d => d.disputeId === disputeId);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

  const escrows = readJSONFile('escrows');
  const escrow = escrows.find(e => e.escrowId === dispute.escrowId);
  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

  const wallets = readJSONFile('wallets');
  const winnerWallet = wallets.find(w => w.userId === winnerId);

  if (!winnerWallet) return res.status(400).json({ error: 'Winner wallet not found' });

  // Move funds to winner
  updateJSONFile('wallets', winnerWallet.id, { balance: winnerWallet.balance + escrow.amount });
  
  const newEscrowStatus = winnerId === escrow.jobPosterId ? 'REFUNDED' : 'RELEASED';
  updateJSONFile('escrows', escrow.escrowId, { status: newEscrowStatus });
  updateJSONFile('disputes', disputeId, { status: 'RESOLVED', resolution, winnerId });

  const txType = newEscrowStatus === 'REFUNDED' ? 'REFUND' : 'ADMIN_RELEASE';
  createTransaction('escrow', winnerId, escrow.amount, escrow.currency, txType, escrow.escrowId);

  res.json({ message: `Dispute resolved in favor of ${winnerId}` });
};

const cancelJob = (req, res) => {
  const { escrowId } = req.body;
  const escrows = readJSONFile('escrows');
  const escrow = escrows.find(e => e.escrowId === escrowId);

  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.jobPosterId !== req.user.id) return res.status(403).json({ error: 'Only job poster can cancel' });
  if (escrow.status !== 'HELD') return res.status(400).json({ error: 'Can only refund HELD escrows' });

  const wallets = readJSONFile('wallets');
  const posterWallet = wallets.find(w => w.userId === req.user.id);
  
  if (posterWallet) {
    updateJSONFile('wallets', posterWallet.id, { balance: posterWallet.balance + escrow.amount });
  }

  updateJSONFile('escrows', escrowId, { status: 'REFUNDED' });
  updateJSONFile('jobs', escrow.jobId, { status: 'CANCELLED' });

  createTransaction('escrow', req.user.id, escrow.amount, escrow.currency, 'REFUND', escrow.escrowId);

  res.json({ message: 'Job cancelled and funds refunded' });
};

module.exports = {
  raiseDispute,
  resolveDispute,
  cancelJob
};
