const express = require('express');
const {body} = require('express-validator');
const validationMiddleware = require('../middleware/validation');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide valid email')
      .custom((value) => {
        return User.findOne({email: value})
          .then(user => {
            if (user) {
              return Promise.reject('User with this email address already exists');
            }
          });
      })
      .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().notEmpty(),
  ],
  validationMiddleware.expressValidation,
  authController.signup
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide valid email')
      .normalizeEmail(),
    body('password').trim().isLength({min: 5}),
  ],
  validationMiddleware.expressValidation,
  authController.login
);

module.exports = router;