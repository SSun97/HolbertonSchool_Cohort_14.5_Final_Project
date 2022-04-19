const Prod = require('../models/prodModel');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopProds = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllProds = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Prod.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const prods = await features.query;
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: prods.length,
    data: {
      prods,
    },
  });
});
exports.getProd = catchAsync(async (req, res, next) => {
  const prod = await Prod.findById(req.params.id);
  if (!prod) {
    return next(new AppError('No prod found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      prod,
    },
  });
});

exports.createProd = catchAsync(async (req, res, next) => {
  const newProd = await Prod.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      prod: newProd,
    },
  });
});

exports.updateProd = catchAsync(async (req, res, next) => {
  const prod = await Prod.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, // return the updated document
    context: 'query',
  }).exec();
  if (!prod) {
    return next(new AppError('No prod found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      prod,
    },
  });
});
exports.deleteProd = catchAsync(async (req, res, next) => {
  const prod = await Prod.findByIdAndDelete(req.params.id);
  if (!prod) {
    return next(new AppError('No prod found with that ID', 404));
  }
  res.status(204).json({
    status: 'successfully deleted',
    data: null,
  });
});

exports.getProdStats = catchAsync(async (req, res, next) => {
  const stats = await Prod.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: { $toUpper: '$ratingsAverage' },
        numProds: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Prod.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numProdStarts: { $sum: 1 },
        prods: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numProdStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
