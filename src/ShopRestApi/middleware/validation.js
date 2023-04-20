const {validationResult} = require('express-validator');

module.exports.expressValidation = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed. Please enter valid data.');
    error.statusCode = 422;
    error.previusErrors = errors.array();

    throw error;
  }

  next();
};