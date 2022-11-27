const http = require('http');

const server = http.createServer((request, response) => {
  console.log(request.url);
  console.log(request.method);
  console.log(request.headers);
  // process.exit();
});

server.listen(process.env.SECOND_INTERNAL_PORT);
