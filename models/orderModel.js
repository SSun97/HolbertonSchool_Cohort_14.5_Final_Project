const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  prod: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prod',
    required: [true, 'Order must belong to a prod'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Order price is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'prod',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
