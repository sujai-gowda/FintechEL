const { v4: uuidv4 } = require('uuid');
const Escrow = require('../models/Escrow');
const Job = require('../models/Job');
const Wallet = require('../models/Wallet');
const { createTransaction } = require('../utils/transaction');
const { readJSONFile, addJSONRecord, updateJSONFile } = require('../utils/storage');
const { refundEscrowToPoster, releaseEscrowToFreelancer } = require('../utils/escrowHelpers');

const raiseDispute = async (req, res) => {
  try {
    const { escrowId, reason } = req.body;
    const escrow = await Escrow.findOne({ escrowId });

    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.jobPosterId !== req.user.id && escrow.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized for this escrow' });
    }

    escrow.status = 'DISPUTED';
    await escrow.save();

    const dispute = {
      disputeId: uuidv4(),
      escrowId,
      raisedBy: req.user.id,
      reason,
      status: 'OPEN',
    };

    addJSONRecord('disputes', dispute);
    await createTransaction(req.user.id, 'system', 0, escrow.currency, 'DISPUTE_CREATED', escrow.escrowId);

    res.json({ message: 'Dispute raised successfully', dispute });
  } catch (error) {
    res.status(500).json({ error: 'Failed to raise dispute' });
  }
};

const resolveDispute = async (req, res) => {
  try {
    const { disputeId, resolution, winnerId } = req.body;

    const disputes = readJSONFile('disputes');
    const dispute = disputes.find((d) => d.disputeId === disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    const escrow = await Escrow.findOne({ escrowId: dispute.escrowId });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

    if (winnerId === escrow.jobPosterId) {
      let posterWallet = await Wallet.findOne({ userId: escrow.jobPosterId });
      if (!posterWallet) {
        posterWallet = await Wallet.create({
          id: uuidv4(),
          userId: escrow.jobPosterId,
          currency: 'INR',
          balance: 0,
        });
      }
      await refundEscrowToPoster(escrow, posterWallet);
      await Job.updateOne({ jobId: escrow.jobId }, { status: 'CANCELLED' });
    } else {
      escrow.freelancerId = winnerId;
      await releaseEscrowToFreelancer(escrow);
      await Job.updateOne({ jobId: escrow.jobId }, { status: 'COMPLETED' });
    }

    updateJSONFile('disputes', disputeId, { status: 'RESOLVED', resolution, winnerId });

    res.json({ message: `Dispute resolved in favor of ${winnerId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
};

const cancelJob = async (req, res) => {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findOne({ escrowId });

    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.jobPosterId !== req.user.id) return res.status(403).json({ error: 'Only job poster can cancel' });
    if (escrow.status !== 'HELD') return res.status(400).json({ error: 'Can only refund HELD escrows' });

    let posterWallet = await Wallet.findOne({ userId: req.user.id });
    if (!posterWallet) {
      posterWallet = await Wallet.create({
        id: uuidv4(),
        userId: req.user.id,
        currency: 'INR',
        balance: 0,
      });
    }

    await refundEscrowToPoster(escrow, posterWallet);
    await Job.updateOne({ jobId: escrow.jobId }, { status: 'CANCELLED' });

    res.json({ message: 'Job cancelled and funds refunded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel job' });
  }
};

module.exports = {
  raiseDispute,
  resolveDispute,
  cancelJob,
};
