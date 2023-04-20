module.exports.errorHandler = (error, request, response, next) => {
  if (!error) {
    next();
  }

  const statusCode = error.statusCode || 500;

  console.log('Debug [' + new Date().toISOString() + ']: ' + error.message + ' Status code: [' + statusCode + ']');

  return response.status(statusCode).json({
    message: error.message,
    errors: error.previusErrors || [],
  });
};