const http = require('http');

const routes = require('./routes');

const server = http.createServer(routes.handler);

server.listen(process.env.SECOND_INTERNAL_PORT);
