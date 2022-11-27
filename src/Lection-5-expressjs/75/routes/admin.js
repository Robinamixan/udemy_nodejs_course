const express = require('express');
const path = require('path');

const rootDir = require('../utils/rootDir');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (request, response, next) => {
  response.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/add-product => POST
router.post('/add-product', (request, response, next) => {
  console.log(request.body);
  response.redirect('/');
});

module.exports = router;
