const { readJSONFile, writeJSONFile, updateJSONFile, addJSONRecord } = require('../utils/storage');
const { createTransaction } = require('../utils/transaction');
const { v4: uuidv4 } = require('uuid');

const fundEscrow = (req, res) => {
  const { jobId, freelancerId } = req.body;
  const posterId = req.user.id;

  const jobs = readJSONFile('jobs');
  const job = jobs.find(j => j.jobId === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  if (job.posterId !== posterId) {
    return res.status(403).json({ error: 'Only the job poster can fund escrow' });
  }
  if (job.status !== 'OPEN' && job.status !== 'ASSIGNED') {
    return res.status(400).json({ error: 'Job is not open for funding' });
  }

  const wallets = readJSONFile('wallets');
  const posterWallet = wallets.find(w => w.userId === posterId);

  if (!posterWallet || posterWallet.balance < job.budget) {
    return res.status(400).json({ error: 'Insufficient balance to fund escrow' });
  }

  // Deduct balance
  updateJSONFile('wallets', posterWallet.id, { balance: posterWallet.balance - job.budget });

  // Create Escrow
  const escrow = {
    escrowId: uuidv4(),
    jobId: job.jobId,
    jobPosterId: posterId,
    freelancerId: freelancerId,
    amount: job.budget,
    currency: job.currency,
    status: 'HELD'
  };
  addJSONRecord('escrows', escrow);

  // Update Job Status
  updateJSONFile('jobs', job.jobId, { status: 'ASSIGNED', freelancerId });

  // Create Transaction
  createTransaction(posterId, 'escrow', job.budget, job.currency, 'ESCROW_FUND', escrow.escrowId);

  res.json({ message: 'Escrow funded successfully', escrow });
};

const getEscrows = (req, res) => {
  const escrows = readJSONFile('escrows');
  res.json(escrows);
};

const getMyEscrows = (req, res) => {
  const escrows = readJSONFile('escrows');
  const myEscrows = escrows.filter(e => e.jobPosterId === req.user.id || e.freelancerId === req.user.id);
  res.json(myEscrows);
};

const submitWork = (req, res) => {
  const { escrowId } = req.body;
  const escrows = readJSONFile('escrows');
  const escrow = escrows.find(e => e.escrowId === escrowId);

  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.freelancerId !== req.user.id) return res.status(403).json({ error: 'Only the freelancer can submit work' });
  if (escrow.status !== 'HELD') return res.status(400).json({ error: 'Invalid escrow state for submission' });

  updateJSONFile('escrows', escrowId, { status: 'SUBMITTED' });
  res.json({ message: 'Work submitted successfully' });
};

const approveWork = (req, res) => {
  const { escrowId } = req.body;
  const escrows = readJSONFile('escrows');
  const escrow = escrows.find(e => e.escrowId === escrowId);

  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.jobPosterId !== req.user.id) return res.status(403).json({ error: 'Only the job poster can approve work' });
  if (escrow.status !== 'SUBMITTED') return res.status(400).json({ error: 'Work has not been submitted yet' });

  const wallets = readJSONFile('wallets');
  const freelancerWallet = wallets.find(w => w.userId === escrow.freelancerId);

  if (freelancerWallet) {
    updateJSONFile('wallets', freelancerWallet.id, { balance: freelancerWallet.balance + escrow.amount });
  } else {
    // Should not happen normally, but just in case
    return res.status(400).json({ error: 'Freelancer wallet not found' });
  }

  updateJSONFile('escrows', escrowId, { status: 'RELEASED' });
  updateJSONFile('jobs', escrow.jobId, { status: 'COMPLETED' });
  
  createTransaction('escrow', escrow.freelancerId, escrow.amount, escrow.currency, 'PAYMENT_RELEASE', escrow.escrowId);

  res.json({ message: 'Work approved and funds released' });
};

module.exports = {
  fundEscrow,
  getEscrows,
  getMyEscrows,
  submitWork,
  approveWork
};
