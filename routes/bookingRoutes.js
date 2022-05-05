const express = require('express');
const { getCheckoutSession } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');
const {getBooking, getAllBookings, createBooking, deleteBooking, updateBooking} = require('../controllers/bookingController');
const router = express.Router();

router.use(protect);
router.get(
  '/checkout-session/:tourID',
  getCheckoutSession
);

router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);
module.exports = router;
