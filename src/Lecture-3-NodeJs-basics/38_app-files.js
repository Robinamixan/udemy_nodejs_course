const http = require('http');

const routes = require('./38_routes');

console.log(routes.someText);

const server = http.createServer(routes.handler);

server.listen(process.env.SECOND_INTERNAL_PORT);
