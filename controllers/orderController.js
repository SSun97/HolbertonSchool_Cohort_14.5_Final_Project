const Prod = require('../models/prodModel');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked prod
  const prod = await Prod.findById(req.params.prodID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?prod=${
      req.params.prodID
    }&user=${req.user.id}&price=${prod.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/prod/${prod.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.prodID,
    line_items: [
      {
        name: `${prod.name} Prod`,
        description: prod.summary,
        images: [
          `https://xrvrnft-simon.herokuapp.com/img/prods/${prod.imageCover}`,
        ],
        amount: prod.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make orders without paying
  const { prod, user, price } = req.query;
  if (!prod && !user && !price) return next();
  await Order.create({ prod, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
