const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/users', (request, response, next) => {
  const users = adminData.users;
  response.render('users', {
    users: users,
    pageTitle: 'Users List',
    path: request.url
  });
})

module.exports = router
