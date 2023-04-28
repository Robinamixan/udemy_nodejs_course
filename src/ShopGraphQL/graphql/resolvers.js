const loginResolver = require('./resolvers/login');
const createUserResolver = require('./resolvers/createUser');
const getUserResolver = require('./resolvers/getUser');
const updateUserStatusResolver = require('./resolvers/updateUserStatus');
const createPostResolver = require('./resolvers/createPost');
const updatePostResolver = require('./resolvers/updatePost');
const deletePostResolver = require('./resolvers/deletePost');
const getPostsResolver = require('./resolvers/getPosts');
const getPostResolver = require('./resolvers/getPost');

module.exports = {
  createUser: createUserResolver,
  login: loginResolver,
  getUser: getUserResolver,
  updateUserStatus: updateUserStatusResolver,
  createPost: createPostResolver,
  updatePost: updatePostResolver,
  deletePost: deletePostResolver,
  getPosts: getPostsResolver,
  getPost: getPostResolver
};
