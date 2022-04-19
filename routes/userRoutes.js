const express = require('express');
const { protect, updatePassword } = require('../controllers/authController');
const { updateMe } = require('../controllers/userController');

const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
// const userController = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
