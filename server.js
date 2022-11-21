'use strict';

const express = require('express');

// Constants
const EXTERNAL_PORT = process.env.EXTERNAL_PORT;
const INTERNAL_PORT = process.env.INTERNAL_PORT;
const HOST = process.env.HOST;

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(INTERNAL_PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${EXTERNAL_PORT}`);
});
