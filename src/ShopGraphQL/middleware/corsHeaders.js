module.exports.corsHeadersHandler = (request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', '*');

  if (request.method === 'OPTIONS') {
    response.sendStatus(200);
  }

  next();
};