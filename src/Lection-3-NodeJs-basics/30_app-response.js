const http = require('http');

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.write('<html lang="en">');
  response.write('<head><title>My first page</title></head>');
  response.write('<body><h1>Hello from my NodeJs Server</h1></body>');
  response.write('</html>');
  response.end();
});

server.listen(process.env.SECOND_INTERNAL_PORT);
