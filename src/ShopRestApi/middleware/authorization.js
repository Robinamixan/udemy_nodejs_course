const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (request, response, next) => {
  const authorizationHeader = request.get('Authorization');
  console.log(request.headers);
  if (!authorizationHeader) {
    throwAuthorizationError();
  }

  let decodedToken;

  try {
    const token = authorizationHeader.split(' ')[1];
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    error.statusCode = 401;

    throw error;
  }

  if (!decodedToken) {
    throwAuthorizationError();
  }

  request.userId = decodedToken.userId;

  next();
};

const throwAuthorizationError = () => {
  const error = new Error('Not authorized.');
  error.statusCode = 401;

  throw error;
};