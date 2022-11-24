const fs = require('fs');

const requestHandler = (request, response) => {
  response.setHeader('Content-Type', 'text/html');

  const url = request.url;
  const method = request.method;

  if (url === '/') {
    response.write('<html lang="en">');
    response.write('<head><title>Input page</title></head>');
    response.write(
        '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    response.write('</html>');

    return response.end();
  }

  if (url === '/message' && method === 'POST') {
    const bodyParts = [];
    request.on('data', (chunk) => {
      bodyParts.push(chunk);
    });

    return request.on('end', () => {
      const bodyValue = Buffer.concat(bodyParts).toString();
      const messageValue = bodyValue.split('=')[1];

      return fs.writeFile('Output/message.txt', messageValue, (error) => {
        response.statusCode = 302;
        response.setHeader('Location', '/');

        return response.end();
      });
    });
  }

  response.write('<html lang="en">');
  response.write('<head><title>My first page</title></head>');
  response.write('<body><h1>Hello from my NodeJs Server</h1></body>');
  response.write('</html>');

  return response.end();
};

// module.exports = requestHandler;

module.exports = {
  handler: requestHandler,
  someText: 'Some hardcoded text',
}

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hardcoded text';
//
// exports.handler = requestHandler;
// exports.someText = 'Some hardcoded text';
