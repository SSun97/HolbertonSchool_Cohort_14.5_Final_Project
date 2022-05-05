const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllProds,
  createProd,
  getProd,
  updateProd,
  deleteProd,
  aliasTopProds,
  getProdStats,
  getMonthlyPlan,
  getProdsWithin,
  getDistances,
  uploadProdImages,
  resizeProdImages,
} = require('../controllers/prodController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:prodId/reviews', reviewRouter);
// /prods-distance?distance=233&center=-40,45&unit=mi
router
  .route('/prods-within/:distance/center/:latlng/unit/:unit')
  .get(getProdsWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllProds)
  .post(protect, restrictTo('admin', 'lead-guide'), createProd);
router
  .route('/:id')
  .get(getProd)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    // uploadProdImages,
    // resizeProdImages,
    updateProd
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteProd);

router.route('/top-5-cheap').get(aliasTopProds, getAllProds);
router.route('/prod-stats').get(getProdStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);
module.exports = router;
