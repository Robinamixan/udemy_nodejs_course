const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');
const corsMiddleware = require('./middleware/corsHeaders');
const errorMiddleware = require('./middleware/errorHandler');
const createError = require('../ShopAppWithNoSQL/util/createError');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(corsMiddleware.corsHeaders);

app.use('/feed', feedRoutes);

app.use(errorMiddleware.errorHandler);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => createError(error));