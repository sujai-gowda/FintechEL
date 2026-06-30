const express = require('express');
const { fundEscrow, getEscrows, getMyEscrows, submitWork, approveWork } = require('../controllers/escrowController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/fund', protect, fundEscrow);
router.post('/submit', protect, submitWork);
router.post('/approve', protect, approveWork);
router.get('/my', protect, getMyEscrows);
router.get('/', protect, adminOnly, getEscrows);

module.exports = router;
