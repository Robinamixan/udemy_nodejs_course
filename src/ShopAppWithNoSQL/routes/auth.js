const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    check('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('E-Mail exists already, please pick a different one.');
            }
          })
      }),
    body(
      'password',
      'Please enter password with only numbers and text and at least 5 characters.'
    )
      .trim()
      .isLength({min: 5})
      .isAlphanumeric(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm password should be equal to original password.');
        }

        return true;
      }),
  ],
  authController.postSignup
);

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    body('email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Please enter a valid email.'),
    body(
      'password',
      'Please enter password with only numbers and text and at least 5 characters.'
    )
      .trim()
      .isLength({min: 5})
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router
