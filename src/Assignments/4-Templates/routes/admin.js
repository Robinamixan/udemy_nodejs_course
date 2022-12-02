const express = require('express');

const router = express.Router();
const users = [];

// / => GET
router.get('/', (request, response, next) => {
  response.render('add-user', {
    pageTitle: 'Add new user',
    path: request.url
  });
});

// /add-user => POST
router.post('/add-user', (request, response, next) => {
  users.push({name: request.body.username});
  response.redirect('/users');
});

module.exports.router = router;
module.exports.users = users;
