const loginResolver = require('./resolvers/login');
const createUserResolver = require('./resolvers/createUser');
const createPostResolver = require('./resolvers/createPost');
const updatePostResolver = require('./resolvers/updatePost');
const getPostsResolver = require('./resolvers/getPosts');
const getPostResolver = require('./resolvers/getPost');

module.exports = {
  createUser: createUserResolver,
  login: loginResolver,
  createPost: createPostResolver,
  updatePost: updatePostResolver,
  getPosts: getPostsResolver,
  getPost: getPostResolver
};
