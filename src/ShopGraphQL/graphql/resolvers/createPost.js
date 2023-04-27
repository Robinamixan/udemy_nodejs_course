const validator = require('validator');

const {assertUserAuthorized} = require('../../util/assert');

const Post = require('../../models/post');
const User = require('../../models/user');

module.exports = async ({postInput}, request) => {
  assertUserAuthorized(request);

  const errors = [];
  if (validator.isEmpty(postInput.title)) {
    errors.push({
      message: 'Title is invalid',
    });
  }

  if (validator.isEmpty(postInput.content)) {
    errors.push({
      message: 'Content is invalid',
    });
  }

  if (errors.length > 0) {
    const error = new Error('invalid input');
    error.data = errors;
    error.statusCode = 422;

    throw error;
  }

  const post = new Post({
    title: postInput.title,
    content: postInput.content,
    imageUrl: postInput.imageUrl,
    creator: request.userId,
  });

  const createdPost = await post.save();
  await createdPost.populate('creator');

  const user = await User.findById(request.userId);
  user.posts.push(createdPost);
  await user.save();

  return {
    ...createdPost._doc,
    _id: createdPost._id.toString(),
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
  };
};