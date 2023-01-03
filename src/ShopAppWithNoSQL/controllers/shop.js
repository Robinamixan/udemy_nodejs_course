const Product = require('./../models/product');
const Order = require('./../models/order');
const log = require('../util/log');

exports.getProducts = (request, response, next) => {
  Product.find()
    .then(products => {
      response.render('shop/products-list', {
        products: products,
        pageTitle: 'Products list',
        path: request.originalUrl,
      });
    })
    .catch(error => log(error));
};

exports.getProductDetails = (request, response, next) => {
  const productId = request.params.productId;

  Product.findById(productId)
    .then(product => {
      response.render('shop/product-details', {
        product: product,
        pageTitle: 'Product details',
        path: request.originalUrl,
      });
    })
    .catch(error => log(error));
};

exports.getIndex = (request, response, next) => {
  Product.find()
    .then(products => {
      response.render('shop/index', {
        products: products,
        pageTitle: 'Shop Main Page',
        path: request.originalUrl,
      });
    })
    .catch(error => log(error));
};

exports.getCart = (request, response, next) => {
  request.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;

      response.render('shop/cart', {
        pageTitle: 'Cart Details',
        path: request.originalUrl,
        items: products,
      });
    })
    .catch(error => log(error));
};

exports.postAddToCart = (request, response, next) => {
  const productId = request.body.productId;

  Product.findById(productId)
    .then(product => {
      request.user.addToCart(product);
      response.redirect('/cart');
    })
    .catch(error => log(error));
};

exports.postCartDeleteItem = (request, response, next) => {
  const productId = request.body.productId;

  request.user.deleteItemFromCart(productId)
    .then(result => {
      response.redirect('/cart');
    })
    .catch(error => log(error));
};

exports.getOrders = (request, response, next) => {
  Order.find({"user.userId": request.user._id})
    .then(orders => {
      response.render('shop/orders', {
        pageTitle: 'Orders',
        path: request.originalUrl,
        orders: orders
      });
    })
    .catch(error => log(error));
};

exports.postCreateOrder = (request, response, next) => {
  request.user.populate('cart.items.productId')
    .then(user => {
      const items = user.cart.items;

      const order = new Order({
        user: {
          name: request.user.name,
          userId: request.user
        },
        items: items.map(item => {
          return {quantity: item.quantity, product: {...item.productId._doc}};
        }),
      });

      return order.save();
    })
    .then(() => {
      return request.user.clearCart()
    })
    .then(() => {
      response.redirect('/orders');
    })
    .catch(error => log(error));
};

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: request.originalUrl,
  });
};

