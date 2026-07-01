const express = require('express');
const {
  getJobs, getMyJobs, getAppliedJobs, createJob, updateJob, deleteJob,
  applyJob, acceptApplicant, toggleWishlist, getWishlist,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, toggleWishlist);
router.get('/applied', protect, getAppliedJobs);

router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

router.get('/myjobs', protect, getMyJobs);
router.post('/:id/apply', protect, applyJob);
router.post('/:id/accept', protect, acceptApplicant);

router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;
