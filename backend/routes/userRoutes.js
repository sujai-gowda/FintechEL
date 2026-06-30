const express = require('express');
const { getUsers, freezeUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.put('/:id/freeze', protect, adminOnly, freezeUser);

module.exports = router;
