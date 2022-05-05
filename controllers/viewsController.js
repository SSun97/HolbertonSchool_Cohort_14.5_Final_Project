const Prod = require('../models/prodModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get prod data from collection
  const prods = await Prod.find();
  res.status(200).render('overview', {
    title: 'All prods',
    prods,
  });
});

exports.getProd = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested prod (including reviews and guides)
  const prod = await Prod.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!prod) {
    return next(new AppError('There is no prod with that name.', 404));
  }
  res.status(200).render('prod', {
    title: `${prod.name} Prod`,
    prod,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};
exports.getMyProds = catchAsync(async (req, res, next) => {
  // 1) Find all orders
  const orders = await Order.find({ user: req.user.id });
  // 2) Find prods with the returned IDs
  const prodIDs = orders.map((el) => el.prod);
  const prods = await Prod.find({ _id: { $in: prodIDs } });
  res.status(200).render('overview', {
    title: 'My Prods',
    prods,
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
