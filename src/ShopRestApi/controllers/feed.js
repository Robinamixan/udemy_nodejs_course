exports.getPosts = (request, response) => {
  response.status(200).json({
    posts: [
      {
        title: 'test_title',
        content: 'test_content'
      }
    ],
  });
};

exports.postPost = (request, response, next) => {
  const title = request.body.title;
  const content = request.body.content;

  response.status(201).json({
    message: 'Post created',
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content
    }
  });
};