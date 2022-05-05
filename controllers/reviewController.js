const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setProdUserIds = (req, res, next) => {
  if (!req.body.prod) req.body.prod = req.params.prodId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReviews = factory.getAll(Review);
exports.deleteReview = factory.deleteOne(Review);
