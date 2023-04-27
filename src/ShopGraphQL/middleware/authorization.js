const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (request, response, next) => {
  const authorizationHeader = request.get('Authorization');
  if (!authorizationHeader) {
    request.isAuthorized = false;
    return next();
  }

  let decodedToken;

  try {
    const token = authorizationHeader.split(' ')[1];
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    request.isAuthorized = false;
    return next();
  }

  if (!decodedToken) {
    request.isAuthorized = false;
    return next();
  }

  request.userId = decodedToken.userId;
  request.isAuthorized = true;

  next();
};
