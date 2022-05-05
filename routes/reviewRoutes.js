const express = require('express');
const {
  getAllReviews,
  createReview,
  updateReview,
  setProdUserIds,
  getReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');
const { deleteReview } = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setProdUserIds, createReview);
router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;
