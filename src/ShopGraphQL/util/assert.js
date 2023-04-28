module.exports.assertUserAuthorized = (request) => {
  if (!request.isAuthorized) {
    const error = new Error('Not authenticated!');
    error.statusCode = 401;

    throw error;
  }
};

module.exports.assertPostExist = (post) => {
  if (!post) {
    const error = new Error('Post was not found.');
    error.statusCode = 404;

    throw error;
  }
};

module.exports.assertRequestFromCreator = (request, post) => {
  if (request.userId !== post.creator._id.toString()) {
    const error = new Error('Not authorized.');
    error.statusCode = 403;

    throw error;
  }
};

module.exports.assertUserExist = (user) => {
  if (!user) {
    const error = new Error('User was not found.');
    error.statusCode = 401;

    throw error;
  }
}