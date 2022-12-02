const express = require('express');

const adminData = require('./admin');

const router = express.Router();

router.get('/', (request, response, next) => {
  const products = adminData.products;
  response.render('shop', {
    products: products,
    pageTitle: 'Shop',
    hasProducts: products.length > 0,
    includeProductCSS: true,
    isShopPage: true,
  });
})

module.exports = router
