const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (request, response, next) => {
  const products = adminData.products;
  response.render('shop', {products: products, pageTitle: 'Shop', path: '/'});
})

module.exports = router
