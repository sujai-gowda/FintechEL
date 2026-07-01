const { verifyWalletPin } = require('../utils/walletPin');
const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const Escrow = require('../models/Escrow');
const {
  lockFundsInEscrow,
  getActiveEscrowForJob,
  releaseEscrowToFreelancer,
} = require('../utils/escrowHelpers');

const fundEscrow = async (req, res) => {
  try {
    const { jobId, pin } = req.body;
    const posterId = req.user.id;

    if (!pin) return res.status(400).json({ error: 'Wallet PIN is required to fund escrow' });

    const job = await Job.findOne({ jobId });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterId !== posterId) return res.status(403).json({ error: 'Only the client can fund escrow' });
    if (!['OPEN', 'ASSIGNED'].includes(job.status)) {
      return res.status(400).json({ error: 'Job is not eligible for escrow funding' });
    }

    const existingEscrow = await getActiveEscrowForJob(jobId);
    if (existingEscrow) {
      return res.status(400).json({ error: 'Escrow already funded for this job' });
    }

    if (job.status === 'ASSIGNED' && !job.freelancerId) {
      return res.status(400).json({ error: 'No freelancer assigned' });
    }

    const pinCheck = await verifyWalletPin(posterId, pin);
    if (!pinCheck.ok) return res.status(401).json({ error: pinCheck.error });

    const posterWallet = pinCheck.wallet;
    if (posterWallet.balance < job.budget) {
      return res.status(400).json({ error: `Insufficient balance. Need ₹${job.budget.toLocaleString('en-IN')}` });
    }

    posterWallet.balance -= job.budget;
    await posterWallet.save();

    const escrow = await lockFundsInEscrow({
      posterId,
      jobId: job.jobId,
      amount: job.budget,
      freelancerId: job.freelancerId || null,
    });

    res.json({
      message: `₹${job.budget.toLocaleString('en-IN')} locked in escrow successfully`,
      escrow,
      wallet: { balance: posterWallet.balance, currency: 'INR' },
    });
  } catch (error) {
    console.error('fundEscrow error:', error);
    res.status(500).json({ error: 'Failed to fund escrow' });
  }
};

const getEscrows = async (req, res) => {
  try {
    const escrows = await Escrow.find().sort({ createdAt: -1 });
    res.json(escrows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch escrows' });
  }
};

const getMyEscrows = async (req, res) => {
  try {
    const escrows = await Escrow.find({
      $or: [
        { jobPosterId: req.user.id },
        { freelancerId: req.user.id },
      ],
    }).sort({ createdAt: -1 });
    res.json(escrows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch escrows' });
  }
};

const submitWork = async (req, res) => {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findOne({ escrowId });

    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned freelancer can submit work' });
    }
    if (escrow.status !== 'HELD') return res.status(400).json({ error: 'Invalid escrow state' });
    if (!escrow.freelancerId) {
      return res.status(400).json({ error: 'No freelancer assigned to this escrow yet' });
    }

    escrow.status = 'SUBMITTED';
    await escrow.save();

    res.json({ message: 'Work submitted successfully. Awaiting client approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit work' });
  }
};

const approveWork = async (req, res) => {
  try {
    const { escrowId, pin } = req.body;
    if (!pin) return res.status(400).json({ error: 'PIN required to release payment' });

    const pinCheck = await verifyWalletPin(req.user.id, pin);
    if (!pinCheck.ok) return res.status(401).json({ error: pinCheck.error });

    const escrow = await Escrow.findOne({ escrowId });

    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    if (escrow.jobPosterId !== req.user.id) return res.status(403).json({ error: 'Only the client can approve' });
    if (escrow.status !== 'SUBMITTED') return res.status(400).json({ error: 'Work not submitted yet' });
    if (!escrow.freelancerId) return res.status(400).json({ error: 'No freelancer assigned' });

    await releaseEscrowToFreelancer(escrow);
    await Job.updateOne({ jobId: escrow.jobId }, { status: 'COMPLETED' });

    res.json({ message: `₹${escrow.amount.toLocaleString('en-IN')} released to freelancer` });
  } catch (error) {
    console.error('approveWork error:', error);
    res.status(500).json({ error: 'Failed to approve work' });
  }
};

module.exports = {
  fundEscrow,
  getEscrows,
  getMyEscrows,
  submitWork,
  approveWork,
};
