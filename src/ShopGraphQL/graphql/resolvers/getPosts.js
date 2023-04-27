const {assertUserAuthorized} = require('../../util/assert');

const Post = require('../../models/post');

module.exports = async ({page, limit}, request) => {
  assertUserAuthorized(request);

  const currentPage = page || 1;
  const itemPerPage = limit || 2;

  const totalCount = await Post.countDocuments();

  const posts = await Post.find()
    .populate('creator')
    .skip((currentPage - 1) * itemPerPage)
    .limit(itemPerPage)
    .sort({createdAt: -1});

  return {
    posts: posts.map(post => {
      return {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      };
    }),
    totalCount: totalCount,
  };
}