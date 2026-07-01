const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    posterId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    jobLinks: [{ type: String }],
    projectLinks: [{ type: String }],
    privacyLevel: { type: String, enum: ['PUBLIC', 'PRIVATE', 'CONFIDENTIAL'], default: 'PUBLIC' },
    securityNotes: { type: String, default: '' },
    budget: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    reward: { type: String, default: '' },
    deadline: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'], default: 'OPEN' },
    freelancerId: { type: String, default: null },
    applicants: [{ type: String }],
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.model('Job', jobSchema);
