const express = require('express');
const { getCheckoutSession } = require('../controllers/orderController');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getOrder,
  getAllOrders,
  createOrder,
  deleteOrder,
  updateOrder,
} = require('../controllers/orderController');
const router = express.Router();

router.use(protect);
router.get('/checkout-session/:prodID', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);
module.exports = router;
