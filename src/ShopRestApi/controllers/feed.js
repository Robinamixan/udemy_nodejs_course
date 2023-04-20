const Post = require('../models/post');

exports.getPosts = (request, response) => {
  response.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'test_title',
        content: 'test_content',
        imageUrl: 'images/Windows_live_square.jpeg',
        createdAt: new Date(),
        creator: {
          name: 'test_user'
        }
      }
    ],
  });
};

exports.postPost = (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imageUrl: 'images/Windows_live_square.jpeg',
    creator: {
      name: 'test_user'
    }
  });

  post.save()
    .then(result => {
      console.log(result);

      response.status(201).json({
        message: 'Post created',
        post: result
      });
    })
    .catch(error => {
      next(error);
    })
};