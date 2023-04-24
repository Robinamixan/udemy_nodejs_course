const Post = require('../models/post');
const User = require('../models/user');

const fileManager = require('../services/fileManager');
const socket = require('../socket');

exports.getPosts = async (request, response, next) => {
  const currentPage = request.query.page || 1;
  const itemPerPage = 2;

  try {
    const totalCount = await Post.countDocuments();

    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * itemPerPage)
      .limit(itemPerPage)
      .sort({createdAt: -1});

    response.status(200).json({
      message: 'Posts fetched.',
      posts: posts,
      totalItems: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostDetails = async (request, response, next) => {
  const postId = request.params.postId;

  try {
    const post = await Post.findById(postId).populate('creator');

    assertPostExist(post);

    response.status(200).json({
      message: 'Post fetched.',
      post: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.postPost = async (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imageUrl: request.file.path,
    creator: request.userId,
  });

  try {
    await post.save();
    await post.populate('creator');

    const user = await User.findById(request.userId);
    user.posts.push(post);
    await user.save();

    socket.getConnection().emit('posts', {
      action: 'create',
      post: post
    });

    response.status(201).json({
      message: 'Post created',
      post: post,
      creator: {
        _id: user._id.toString(),
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.putPost = async (request, response, next) => {
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

  try {
    const post = await Post.findById(postId).populate('creator');

    assertPostExist(post);
    assertRequestFromCreator(request, post);

    if (imageUrl !== post.imageUrl) {
      fileManager.deleteFile(post.imageUrl);
    }

    post.title = request.body.title;
    post.content = request.body.content;
    post.imageUrl = imageUrl;
    await post.save();

    socket.getConnection().emit('posts', {
      action: 'update',
      post: post
    });

    response.status(200).json({
      message: 'Post updated.',
      post: post,
    });

  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (request, response, next) => {
  const postId = request.params.postId;

  try {
    const post = await Post.findById(postId);

    assertPostExist(post);
    assertRequestFromCreator(request, post);

    fileManager.deleteFile(post.imageUrl);
    await post.delete();

    const user = await User.findById(request.userId);
    user.posts.pull(postId);
    await user.save();

    socket.getConnection().emit('posts', {
      action: 'delete',
      post: post
    });

    response.status(200).json({
      message: 'Post deleted.',
    });
  } catch (error) {
    next(error);
  }
};

const assertPostExist = (post) => {
  if (!post) {
    const error = new Error('Post was not found.');
    error.statusCode = 404;

    throw error;
  }
};

const assertRequestFromCreator = (request, post) => {
  if (request.userId !== post.creator._id.toString()) {
    const error = new Error('Not authorized.');
    error.statusCode = 403;

    throw error;
  }
};