const express = require('express');
const { raiseDispute, resolveDispute, cancelJob } = require('../controllers/disputeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/raise', protect, raiseDispute);
router.post('/resolve', protect, adminOnly, resolveDispute);
router.post('/cancel', protect, cancelJob);

module.exports = router;
