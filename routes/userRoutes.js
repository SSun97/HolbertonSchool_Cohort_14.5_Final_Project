const express = require('express');

const {
  protect,
  updatePassword,
  restrictTo,
} = require('../controllers/authController');
const {
  updateMe,
  deleteMe,
  getMe,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/userController');

const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
// const userController = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
