module.exports.errorHandler = (error, request, response, next) => {
  if (!error) {
    next();
  }

  const statusCode = error.statusCode || 500;

  console.log('Debug [' + new Date().toISOString() + ']: ' + error.message + ' Status code: [' + statusCode + ']');

  const responseData = {message: error.message}

  if (error.previusErrors) {
    responseData.errors = error.previusErrors;
  }

  return response.status(statusCode).json(responseData);
};