const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
const {
  getAllProds,
  createProd,
  getProd,
  updateProd,
  deleteProd,
  aliasTopProds,
  getProdStats,
  getMonthlyPlan,
} = require('../controllers/prodController');

// router.param('id', checkID);

// create a checkBody middleware
// check if the body contains the name and price properties
// if not, return a 400 error
// if it does, call next()
router.route('/top-5-cheap').get(aliasTopProds, getAllProds);
router.route('/prod-stats').get(getProdStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllProds).post(createProd);
router
  .route('/:id')
  .get(getProd)
  .patch(updateProd)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteProd);

module.exports = router;
