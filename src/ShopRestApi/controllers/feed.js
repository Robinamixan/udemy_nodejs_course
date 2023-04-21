const Post = require('../models/post');
const User = require('../models/user');

const fileManager = require('../services/fileManager');

exports.getPosts = (request, response) => {
  const currentPage = request.query.page || 1;
  const itemPerPage = 2;
  let totalCount;

  Post.countDocuments()
    .then(count => {
      totalCount = count;

      return Post.find()
        .skip((currentPage - 1) * itemPerPage)
        .limit(itemPerPage);
    })
    .then(posts => {
      response.status(200).json({
        message: 'Posts fetched.',
        posts: posts,
        totalItems: totalCount,
      });
    })
    .catch(error => next(error));
};

exports.getPostDetails = (request, response, next) => {
  const postId = request.params.postId;

  Post.findById(postId)
    .then(post => {
      assertPostExist(post);

      response.status(200).json({
        message: 'Post fetched.',
        post: post,
      });
    })
    .catch(error => next(error));
};

exports.postPost = (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imageUrl: request.file.path,
    creator: request.userId,
  });
  let creator;

  post.save()
    .then(() => {
      return User.findById(request.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);

      return user.save();
    })
    .then(user => {
      response.status(201).json({
        message: 'Post created',
        post: post,
        creator: {
          _id: user._id.toString(),
          name: user.name
        }
      });
    })
    .catch(error => {
      next(error);
    });
};

exports.putPost = (request, response, next) => {
  const postId = request.params.postId;
  let imageUrl = request.body.image;
  if (request.file) {
    imageUrl = request.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;

    throw error;
  }

  Post.findById(postId)
    .then(post => {
      assertPostExist(post);
      assertRequestFromCreator(request, post);

      if (imageUrl !== post.imageUrl) {
        fileManager.deleteFile(post.imageUrl);
      }

      post.title = request.body.title;
      post.content = request.body.content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      response.status(200).json({
        message: 'Post updated.',
        post: result,
      });
    })
    .catch(error => {
      next(error);
    });
};

exports.deletePost = (request, response, next) => {
  const postId = request.params.postId;

  Post.findById(postId)
    .then(post => {
      assertPostExist(post);
      assertRequestFromCreator(request, post);

      fileManager.deleteFile(post.imageUrl);

      return post.delete();
    })
    .then(() => {
      return User.findById(request.userId);
    })
    .then(user => {
      user.posts.pull(postId);

      return user.save();
    })
    .then(() => {
      response.status(200).json({
        message: 'Post deleted.',
      });
    })
    .catch(error => {
      next(error);
    });
};

const assertPostExist = (post) => {
  if (!post) {
    const error = new Error('Post was not found.');
    error.statusCode = 404;

    throw error;
  }
};

const assertRequestFromCreator = (request, post) => {
  if (request.userId !== post.creator.toString()) {
    const error = new Error('Not authorized.');
    error.statusCode = 403;

    throw error;
  }
};