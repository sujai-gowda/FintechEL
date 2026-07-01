const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Job = require('../models/Job');
const Message = require('../models/Message');

const getStats = async (req, res) => {
  try {
    const clients = await User.countDocuments({ role: 'Client' });
    const freelancers = await User.countDocuments({ role: 'Freelancer' });
    const wallets = await Wallet.find();
    const jobs = await Job.find();
    const messages = await Message.countDocuments();

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const openJobs = jobs.filter((j) => j.status === 'OPEN').length;
    const totalJobValue = jobs.reduce((sum, j) => sum + j.budget, 0);

    res.json({
      clients,
      freelancers,
      totalUsers: clients + freelancers,
      totalBalance,
      currency: 'INR',
      openJobs,
      totalJobs: jobs.length,
      totalJobValue,
      totalMessages: messages,
      wallets: wallets.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = { getStats };
