const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post(
  '/posts',
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
  ],
  validationMiddleware.expressValidation,
  feedController.postPost
);

module.exports = router;
