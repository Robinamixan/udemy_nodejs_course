const express = require('express');

const app = express();

app.use('/users', (request, response, next) => {
  response.send('<ul><li>User1</li><li>User2</li><li>User3</li></ul>');
});

app.use('/', (request, response, next) => {
  response.send('<h1>This is assignment for lecture 5</h1>');
})

app.listen(process.env.SECOND_INTERNAL_PORT);
