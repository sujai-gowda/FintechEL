const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, id: false }
);

module.exports = mongoose.model('Message', messageSchema);
