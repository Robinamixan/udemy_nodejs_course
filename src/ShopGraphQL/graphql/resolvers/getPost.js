const {assertUserAuthorized, assertPostExist} = require('../../util/assert');

const Post = require('../../models/post');

module.exports = async ({postId}, request) => {
  assertUserAuthorized(request);

  const post = await Post.findById(postId).populate('creator');

  assertPostExist(post);

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}