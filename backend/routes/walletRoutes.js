const express = require('express');
const { getWallets, getMyWallet, assignBalance } = require('../controllers/walletController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getWallets);
router.get('/me', protect, getMyWallet);
router.post('/assign', protect, adminOnly, assignBalance);

module.exports = router;
