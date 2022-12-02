const express = require('express');

const router = express.Router();
const products = [];

// /admin/add-product => GET
router.get('/add-product', (request, response, next) => {
  response.render('add-product', {
    pageTitle: 'Add product',
    includeProductCSS: true,
    includeFormCSS: true,
    isAddProductPage: true,
  });
});

// /admin/add-product => POST
router.post('/add-product', (request, response, next) => {
  products.push({title: request.body.title});
  response.redirect('/');
});

module.exports.router = router;
module.exports.products = products;
