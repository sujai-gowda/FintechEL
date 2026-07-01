const express = require('express');
const { sendMessage, getConversation, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.post('/send', protect, sendMessage);
router.get('/:jobId/:userId', protect, getConversation);

module.exports = router;
