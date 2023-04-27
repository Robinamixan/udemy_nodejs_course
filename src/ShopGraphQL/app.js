const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {graphqlHTTP} = require('express-graphql');

const corsMiddleware = require('./middleware/corsHeaders');
const errorMiddleware = require('./middleware/errorHandler');
const fileMiddleware = require('./middleware/fileUploader');
const createError = require('../ShopAppWithNoSQL/util/createError');
const path = require('path');
const uploadDir = require('../utils/uploadDir');
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const authorization = require('./middleware/authorization');
const fileManager = require('./util/file');

const app = express();

app.use(bodyParser.json());
app.use(corsMiddleware.corsHeadersHandler);
app.use(fileMiddleware.prepareUploadHandler('image'));

app.use('/images', express.static(path.join(uploadDir, 'upload')));
app.use('/upload', express.static(path.join(uploadDir, 'upload')));

app.put('/post-image', (request, response, next) => {
  if (!request.file) {
    response.status(200).json({ message: 'No image provided.'});
  }

  if (request.body.oldPath) {
    fileManager.deleteFile(request.body.oldPath);
  }

  response.status(201).json({ message: 'file stored.', filePath: request.file.path});
});

app.use(authorization);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
  customFormatErrorFn(error) {
    if (!error.originalError) {
      return error;
    }

    return {
      message: error.message || 'Error occurred',
      status: error.originalError.statusCode || 500,
      data: error.originalError.data
    };
  }
}));

app.use(errorMiddleware.errorHandler);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => createError(error));