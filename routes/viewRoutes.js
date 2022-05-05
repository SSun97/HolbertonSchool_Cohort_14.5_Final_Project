const express = require('express');
const {
  getOverview,
  getProd,
  getLoginForm,
  getAccount,
  getMyProds,
  updateUserData,
} = require('../controllers/viewsController');
const { isLoggedIn, protect } = require('../controllers/authController');
const { createOrderCheckout } = require('../controllers/orderController');

const router = express.Router();
router.use(isLoggedIn);
router.get('/', createOrderCheckout, isLoggedIn, getOverview);
router.get('/prod/:slug', isLoggedIn, getProd);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-prods', protect, getMyProds);
router.post('/submit-user-data', protect, updateUserData);
module.exports = router;
