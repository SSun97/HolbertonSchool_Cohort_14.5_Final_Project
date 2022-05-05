// review/ rating/ created At/ ref to prod , ref to user
const mongoose = require('mongoose');
const Prod = require('./prodModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
      maxlength: [200, 'Review must be less than 200 characters'],
      minlength: [10, 'Review must be more than 10 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    // ref to prod, ref to user
    prod: {
      type: mongoose.Schema.ObjectId,
      ref: 'Prod',
      required: [true, 'Review must belong to a prod'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.index({ prod: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
reviewSchema.statics.calcAvgRatings = async function (prodId) {
  const stats = await this.aggregate([
    {
      $match: { prod: prodId },
    },
    {
      $group: {
        _id: '$prod',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  await Prod.findByIdAndUpdate(prodId, {
    ratingsQuantity: stats.length > 0 ? stats[0].nRating : 0,
    ratingsAverage: stats.length > 0 ? stats[0].avgRating : 4.5,
  });
};
reviewSchema.post('save', function () {
  // console.log(this.constructor.model.calcAvgRating);
  this.constructor.calcAvgRatings(this.prod);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // does not work here because query is not available
  await this.r.constructor.calcAvgRatings(this.r.prod);
  // console.log(this.r);
});

const Review = mongoose.model('Review', reviewSchema);
// Review.on('index', (err) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Review indexing complete');
//   }
// });
module.exports = Review;
