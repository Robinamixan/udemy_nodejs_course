const fs = require('fs');

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'text/html');

  const url = request.url;
  const method = request.method;

  if (url === '/') {
    response.write('<html lang="en">');
    response.write('<head><title>Input page</title></head>');
    response.write(
        '<body><form action="/create-user" method="POST"><input type="text" name="username" placeholder="User Name"><button type="submit">Send</button></form></body>');
    response.write('</html>');

    return response.end();
  }

  if (url === '/users') {
    response.write('<html lang="en">');
    response.write('<head><title>List of Users</title></head>');
    response.write(
        '<body><ul><li>User1</li><li>User2</li><li>User3</li></ul></body>');
    response.write('</html>');

    return response.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const bodyParts = [];
    request.on('data', (chunk) => {
      bodyParts.push(chunk);
    });

    return request.on('end', () => {
      const bodyValue = Buffer.concat(bodyParts).toString();
      const username = bodyValue.split('=')[1];

      console.log(username);

      response.statusCode = 302;
      response.setHeader('Location', '/');

      return response.end();
    });
  }

  response.write('<html lang="en">');
  response.write('<head><title>Assignment</title></head>');
  response.write('<body><h1>This is assignment for lecture 3</h1></body>');
  response.write('</html>');

  return response.end();
};

module.exports = {
  handler: requestHandler,
}
