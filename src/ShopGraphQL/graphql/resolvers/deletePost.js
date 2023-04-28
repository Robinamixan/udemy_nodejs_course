const {assertUserAuthorized, assertPostExist, assertRequestFromCreator} = require('../../util/assert');

const Post = require('../../models/post');
const fileManager = require('../../services/fileManager');
const User = require('../../models/user');

module.exports = async ({id}, request) => {
  assertUserAuthorized(request);

  const post = await Post.findById(id);

  assertPostExist(post);
  assertRequestFromCreator(request, post);

  fileManager.deleteFile(post.imageUrl);
  await post.delete();

  const user = await User.findById(request.userId);
  user.posts.pull(id);
  await user.save();

  return {_id: id};
}