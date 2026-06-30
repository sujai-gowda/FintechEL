const { readJSONFile, writeJSONFile, updateJSONFile, addJSONRecord } = require('../utils/storage');
const { v4: uuidv4 } = require('uuid');

const getJobs = (req, res) => {
  const jobs = readJSONFile('jobs');
  res.json(jobs);
};

const getMyJobs = (req, res) => {
  const jobs = readJSONFile('jobs');
  const myJobs = jobs.filter(j => j.posterId === req.user.id);
  res.json(myJobs);
};

const createJob = (req, res) => {
  const { title, description, budget, currency, deadline } = req.body;

  if (!title || !budget || !currency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const job = {
    jobId: uuidv4(),
    posterId: req.user.id,
    title,
    description,
    budget: Number(budget),
    currency,
    deadline,
    status: 'OPEN', // OPEN, ASSIGNED, COMPLETED, CANCELLED
    freelancerId: null
  };

  const newJob = addJSONRecord('jobs', job);
  res.status(201).json({ message: 'Job created successfully', job: newJob });
};

const updateJob = (req, res) => {
  const { id } = req.params;
  const { title, description, budget, currency, deadline } = req.body;

  const jobs = readJSONFile('jobs');
  const job = jobs.find(j => j.jobId === id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.posterId !== req.user.id && req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Not authorized to update this job' });
  }

  updateJSONFile('jobs', id, { title, description, budget: Number(budget), currency, deadline });
  res.json({ message: 'Job updated successfully' });
};

const deleteJob = (req, res) => {
  const { id } = req.params;
  let jobs = readJSONFile('jobs');
  
  const job = jobs.find(j => j.jobId === id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.posterId !== req.user.id && req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Not authorized to delete this job' });
  }

  jobs = jobs.filter(j => j.jobId !== id);
  writeJSONFile('jobs', jobs);

  res.json({ message: 'Job deleted successfully' });
};

module.exports = {
  getJobs,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob
};
