const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');
const validationMiddleware = require('../middleware/validation');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.get('/posts/:postId', feedController.getPostDetails);

router.post(
  '/posts',
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
  ],
  validationMiddleware.fileUploadValidation,
  validationMiddleware.expressValidation,
  feedController.postPost
);

router.put(
  '/posts/:postId',
  [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
  ],
  validationMiddleware.expressValidation,
  feedController.putPost
);

router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;
