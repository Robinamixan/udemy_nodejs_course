const createError = (error, code) => {
  error = new Error(error);
  error.httpStatusCode = code ? code : 500;

  return error;
}

module.exports = createError;
