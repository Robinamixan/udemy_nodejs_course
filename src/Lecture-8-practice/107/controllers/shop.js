const Product = require('./../models/product')

exports.getProducts = (request, response, next) => {
  Product.fetchAll((products) => {
    response.render('shop/products-list', {
      products: products,
      pageTitle: 'Products list',
      path: '/products'
    });
  });
};

exports.getIndex = (request, response, next) => {
  Product.fetchAll((products) => {
    response.render('shop/index', {
      products: products,
      pageTitle: 'Shop Main Page',
      path: '/'
    });
  });
};

exports.getCart = (request, response, next) => {
  response.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};

exports.getOrders = (request, response, next) => {
  response.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

