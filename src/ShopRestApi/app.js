const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const corsMiddleware = require('./middleware/corsHeaders');
const errorMiddleware = require('./middleware/errorHandler');
const fileMiddleware = require('./middleware/fileUploader');
const createError = require('../ShopAppWithNoSQL/util/createError');
const path = require('path');
const uploadDir = require('../utils/uploadDir');

const app = express();

app.use(bodyParser.json());
app.use(corsMiddleware.corsHeadersHandler);
app.use(fileMiddleware.prepareUploadHandler('image'));

app.use('/images', express.static(path.join(uploadDir, 'upload')));
app.use('/upload', express.static(path.join(uploadDir, 'upload')));

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use(errorMiddleware.errorHandler);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => createError(error));