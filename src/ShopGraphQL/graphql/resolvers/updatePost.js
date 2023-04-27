const {assertUserAuthorized, assertPostExist, assertRequestFromCreator} = require('../../util/assert');

const Post = require('../../models/post');

module.exports = async ({id, postInput}, request) => {
  assertUserAuthorized(request);

  const post = await Post.findById(id).populate('creator');

  assertPostExist(post);
  assertRequestFromCreator(request, post);

  post.title = postInput.title;
  post.content = postInput.content;
  if (postInput.imageUrl !== 'undefined') {
    post.imageUrl = postInput.imageUrl;
  }

  await post.save();

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  };
}