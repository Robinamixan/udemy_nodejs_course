const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', (request, response, next) => {
  response.sendFile(path.join(__dirname, 'views', 'users.html'));
});

app.use('/', (request, response, next) => {
  response.sendFile(path.join(__dirname, 'views', 'main.html'));
})

app.listen(process.env.SECOND_INTERNAL_PORT);
