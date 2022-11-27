const express = require('express');

const app = express();

// Middleware will be executed for every request
app.use((request, response, next) => {
  console.log('In the middleware!');
  next(); // Allows the request to continue to next middleware
});

app.use('/add-product', (request, response, next) => {
  response.send('<h1>Page with "add-product" url</h1>');
});

app.use('/', (request, response, next) => {
  response.send('<h1>Hello from express.js</h1>');
})

app.listen(process.env.SECOND_INTERNAL_PORT);
