const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const prodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A prod must have a name'],
      unique: true,
      maxlength: [40, 'A prod name must have less or equal then 40 characters'],
      minlength: [10, 'A prod name must have more or equal then 10 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'en-US', {
            ignore: ' -',
          });
        },
        message: `A prod name must only contain characters.`,
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [false, 'A prod must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [false, 'A prod must have a group size'],
    },
    difficulty: {
      type: String,
      required: [false, 'A prod must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A prod must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          console.log(this);
          return val < this._update.$set.price;
        },
        message: `Discount price ({VALUE}) should be below regular price.`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [false, 'A prod must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [false, 'A prod must have a summary'],
    },
    imageCover: {
      type: String,
      required: [true, 'A prod must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretProd: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

prodSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; //cannot query durationWeeks directly
});

// Document Middleware - runs before .save() and .create()
prodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //this refers to the current document
  next();
});
// prodSchema.pre('save', (next) => {
//   console.log('Will save document...');
//   next();
// });

// prodSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

prodSchema.pre(/^find/, function () {
  this.find({ secretProd: { $ne: true } }); //this references the current query
  this._start = Date.now();
  console.log(`Query started on ${this.start}`);
  // next();
});
prodSchema.post(/^find/, function (docs, next) {
  //run after query execution
  console.log(`Query took ${Date.now() - this._start} milliseconds`); //this references the current query
  next();
});
prodSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretProd: { $ne: true } } }); //this references the current aggregation object
  next();
});

const Prod = mongoose.model('Prod', prodSchema);
module.exports = Prod;
