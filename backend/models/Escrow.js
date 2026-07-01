const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema(
  {
    escrowId: { type: String, required: true, unique: true },
    jobId: { type: String, required: true, index: true },
    jobPosterId: { type: String, required: true },
    freelancerId: { type: String, default: null },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['HELD', 'SUBMITTED', 'RELEASED', 'REFUNDED', 'DISPUTED'],
      default: 'HELD',
    },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.model('Escrow', escrowSchema);
