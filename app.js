const path = require('path');
const express = require('express');

const app = express();
app.enable('trust proxy');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
app.use(cors());
// only for simple requests which are GET, POST others are not allowed
// access-control-allow-origin *
// api.natours.com, front-end natours.com
// aoo,use(cors({
//   origin: 'http://localhost:3000' // allow to server to accept request from different origin
// }));
app.options('*', cors());
//app.options('/api/v1/tours/:id', cors()); // only allow to access to the specific route
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 1) GLOBAL MIDDLEWARES
//serving static files
app.use(express.static(path.join(__dirname, 'public')));
// set security HTTP headers
// app.use(helmet());
// use helmet, allow cross origin requests from only mapbox.com
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        'blob:',
        'https://*.mapbox.com',
        'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
        'http://localhost:3000/api/v1/users/login',
        "https://js.stripe.com/",
        'ws://127.0.0.1:*/',
      ],
      scriptSrc: [
        "'self'",
        'https://*.mapbox.com',
        'https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js',
        'http://localhost:3000/api/v1/users/login',
        "'unsafe-inline'",
        "https://js.stripe.com/v3",
        'blob:',
      ],
    },
  })
);

// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// limit requests from same IP
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
app.use(compression());
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
