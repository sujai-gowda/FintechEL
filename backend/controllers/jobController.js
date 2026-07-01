const { v4: uuidv4 } = require('uuid');
const Job = require('../models/Job');
const Escrow = require('../models/Escrow');
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { verifyWalletPin } = require('../utils/walletPin');
const { lockFundsInEscrow, getActiveEscrowForJob, refundEscrowToPoster } = require('../utils/escrowHelpers');

const enrichApplicants = async (jobs) => {
  const applicantIds = [...new Set(jobs.flatMap((j) => j.applicants || []))];
  const freelancerIds = jobs.map((j) => j.freelancerId).filter(Boolean);
  const users = await User.find({ id: { $in: [...applicantIds, ...freelancerIds] } });
  const userMap = Object.fromEntries(users.map((u) => [u.id, { id: u.id, name: u.name, email: u.email }]));

  return jobs.map((j) => {
    const obj = j.toObject ? j.toObject() : j;
    return {
      ...obj,
      applicantDetails: (obj.applicants || []).map((id) => userMap[id]).filter(Boolean),
      freelancerDetails: obj.freelancerId ? userMap[obj.freelancerId] : null,
    };
  });
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: 'OPEN',
      applicants: { $nin: [req.user.id] },
    }).sort({ createdAt: -1 });

    const users = await User.find({ id: { $in: jobs.map((j) => j.posterId) } });
    const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

    res.json(jobs.map((j) => ({
      ...j.toObject(),
      clientName: userMap[j.posterId] || 'Client',
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ posterId: req.user.id }).sort({ createdAt: -1 });
    const enriched = await enrichApplicants(jobs);
    const escrows = await Escrow.find({ jobId: { $in: jobs.map((j) => j.jobId) } });
    const escrowMap = Object.fromEntries(escrows.map((e) => [e.jobId, e]));

    res.json(enriched.map((job) => ({
      ...job,
      escrow: escrowMap[job.jobId] || null,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      $or: [
        { applicants: req.user.id },
        { freelancerId: req.user.id },
      ],
    }).sort({ createdAt: -1 });

    const users = await User.find({ id: { $in: jobs.map((j) => j.posterId) } });
    const userMap = Object.fromEntries(users.map((u) => [u.id, { id: u.id, name: u.name, email: u.email }]));

    res.json(jobs.map((j) => ({
      ...j.toObject(),
      clientDetails: userMap[j.posterId] || null,
      applicationStatus: j.freelancerId === req.user.id ? 'ACCEPTED' : 'PENDING',
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applied jobs' });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      title, description, budget, deadline, pin,
      jobLinks, projectLinks, privacyLevel, securityNotes, reward,
    } = req.body;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!pin) {
      return res.status(400).json({ error: 'Wallet PIN is required to lock funds in escrow' });
    }

    const budgetAmount = Number(budget);
    if (budgetAmount < 1) {
      return res.status(400).json({ error: 'Budget must be at least ₹1' });
    }

    const pinCheck = await verifyWalletPin(req.user.id, pin);
    if (!pinCheck.ok) return res.status(401).json({ error: pinCheck.error });

    const posterWallet = pinCheck.wallet;
    if (posterWallet.balance < budgetAmount) {
      return res.status(400).json({
        error: `Insufficient wallet balance. Need ₹${budgetAmount.toLocaleString('en-IN')} to hold in escrow.`,
      });
    }

    const jobId = uuidv4();
    const job = await Job.create({
      jobId,
      posterId: req.user.id,
      title,
      description,
      budget: budgetAmount,
      currency: 'INR',
      deadline,
      jobLinks: jobLinks?.filter(Boolean) || [],
      projectLinks: projectLinks?.filter(Boolean) || [],
      privacyLevel: privacyLevel || 'PUBLIC',
      securityNotes: securityNotes || '',
      reward: reward || '',
      status: 'OPEN',
      applicants: [],
    });

    posterWallet.balance -= budgetAmount;
    await posterWallet.save();

    const escrow = await lockFundsInEscrow({
      posterId: req.user.id,
      jobId,
      amount: budgetAmount,
    });

    res.status(201).json({
      message: `Job posted. ₹${budgetAmount.toLocaleString('en-IN')} is held in escrow until work is completed.`,
      job,
      escrow,
      wallet: { balance: posterWallet.balance, currency: 'INR' },
    });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const fields = ['title', 'description', 'budget', 'deadline', 'jobLinks', 'projectLinks', 'privacyLevel', 'securityNotes', 'reward'];
    fields.forEach((f) => { if (req.body[f] !== undefined) job[f] = req.body[f]; });
    if (req.body.budget) job.budget = Number(req.body.budget);
    await job.save();

    res.json({ message: 'Job updated', job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (job.status === 'ASSIGNED') {
      return res.status(400).json({ error: 'Cannot delete an assigned job. Cancel escrow first.' });
    }

    const escrow = await getActiveEscrowForJob(job.jobId);
    if (escrow && escrow.status === 'HELD') {
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
    }

    await Job.deleteOne({ jobId: req.params.id });
    res.json({ message: escrow ? 'Job deleted and escrow refunded to your wallet' : 'Job deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};

const applyJob = async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'OPEN') return res.status(400).json({ error: 'Job is no longer open' });
    if (job.posterId === req.user.id) return res.status(400).json({ error: 'Cannot apply to your own job' });
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already applied' });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.json({
      message: 'Application submitted! Job moved to My Applications.',
      job,
      removedFromMarketplace: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply' });
  }
};

const acceptApplicant = async (req, res) => {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findOne({ jobId: req.params.id });

    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posterId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    if (job.status !== 'OPEN') return res.status(400).json({ error: 'Job is not open' });
    if (!job.applicants.includes(freelancerId)) {
      return res.status(400).json({ error: 'Freelancer has not applied to this job' });
    }

    job.freelancerId = freelancerId;
    job.status = 'ASSIGNED';
    await job.save();

    const escrow = await getActiveEscrowForJob(job.jobId);
    if (escrow && !escrow.freelancerId) {
      escrow.freelancerId = freelancerId;
      await escrow.save();
    }

    const freelancer = await User.findOne({ id: freelancerId });
    const escrowFunded = escrow?.status === 'HELD';

    res.json({
      message: escrowFunded
        ? `${freelancer?.name || 'Freelancer'} accepted! ₹${job.budget.toLocaleString('en-IN')} is already held in escrow — they can start work.`
        : `${freelancer?.name || 'Freelancer'} accepted! Fund escrow to lock payment.`,
      job,
      escrow,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept applicant' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { jobId } = req.body;
    const existing = await Wishlist.findOne({ userId: req.user.id, jobId });

    if (existing) {
      await Wishlist.deleteOne({ id: existing.id });
      return res.json({ message: 'Removed from wishlist', wishlisted: false });
    }

    await Wishlist.create({ id: uuidv4(), userId: req.user.id, jobId });
    res.json({ message: 'Added to wishlist', wishlisted: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id });
    const jobIds = items.map((i) => i.jobId);
    const jobs = await Job.find({
      jobId: { $in: jobIds },
      status: 'OPEN',
      applicants: { $nin: [req.user.id] },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

module.exports = {
  getJobs,
  getMyJobs,
  getAppliedJobs,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  acceptApplicant,
  toggleWishlist,
  getWishlist,
};
