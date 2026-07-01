const { v4: uuidv4 } = require('uuid');
const Message = require('../models/Message');
const Job = require('../models/Job');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { jobId, receiverId, content } = req.body;
    if (!jobId || !receiverId || !content?.trim()) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await Job.findOne({ jobId });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const participants = [job.posterId, job.freelancerId, ...(job.applicants || [])].filter(Boolean);
    const isParticipant = participants.includes(req.user.id) && participants.includes(receiverId);

    if (!isParticipant && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'You can only message participants on this job' });
    }

    const message = await Message.create({
      messageId: uuidv4(),
      jobId,
      senderId: req.user.id,
      receiverId,
      content: content.trim(),
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const getConversation = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const messages = await Message.find({
      jobId,
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    const job = await Job.findOne({ jobId });
    const otherUser = await User.findOne({ id: userId });

    res.json({
      messages,
      jobTitle: job?.title || 'Job',
      otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, role: otherUser.role } : null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
    }).sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];

    for (const m of messages) {
      const otherId = m.senderId === req.user.id ? m.receiverId : m.senderId;
      const key = `${m.jobId}-${otherId}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const [job, otherUser] = await Promise.all([
        Job.findOne({ jobId: m.jobId }),
        User.findOne({ id: otherId }),
      ]);

      conversations.push({
        jobId: m.jobId,
        jobTitle: job?.title || 'Job',
        userId: otherId,
        userName: otherUser?.name || 'User',
        userRole: otherUser?.role || '',
        lastMessage: m.content,
        lastAt: m.createdAt,
      });
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

module.exports = { sendMessage, getConversation, getConversations };
