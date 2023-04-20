const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const corsMiddleware = require('./middleware/corsHeaders');

const app = express();
app.use(bodyParser.json());

app.use(corsMiddleware.corsHeaders);

app.use('/feed', feedRoutes);

app.listen(process.env.SECOND_INTERNAL_PORT);