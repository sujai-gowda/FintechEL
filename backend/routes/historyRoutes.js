const express = require('express');
const { getMyTransactions, getAllTransactions, getMyNotifications } = require('../controllers/historyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/transactions/my', protect, getMyTransactions);
router.get('/transactions/all', protect, adminOnly, getAllTransactions);
router.get('/notifications/my', protect, getMyNotifications);

module.exports = router;
