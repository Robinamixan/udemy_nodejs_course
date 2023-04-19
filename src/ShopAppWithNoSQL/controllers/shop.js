const { validationResult } = require('express-validator');

const Product = require('./../models/product');
const Order = require('./../models/order');
const log = require('../util/log');
const pdfInvoiceGenerator = require('../services/pdfInvoiceGenerator');
const createError = require('../util/createError');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (request, response, next) => {
  const page = +request.query.page || 1;
  let totalCount = 0;

  Product.countDocuments()
    .then(count => {
      totalCount = count;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      response.render('shop/products-list', {
        products: products,
        pageTitle: 'Products list',
        paginationInfo: {
          page: page,
          totalCount: totalCount,
          itemsPerPage: ITEMS_PER_PAGE,
          lastPage: Math.ceil(totalCount/ ITEMS_PER_PAGE)
        }
      });
    })
    .catch(error => next(createError(error)));
};

exports.getProductDetails = (request, response, next) => {
  const productId = request.params.productId;

  Product.findById(productId)
    .then(product => {
      response.render('shop/product-details', {
        product: product,
        pageTitle: 'Product details'
      });
    })
    .catch(error => next(createError(error)));
};

exports.getIndex = (request, response, next) => {
  const page = +request.query.page || 1;
  let totalCount = 0;

  Product.countDocuments()
    .then(count => {
      totalCount = count;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      response.render('shop/index', {
        products: products,
        pageTitle: 'Shop Main Page',
        paginationInfo: {
          page: page,
          totalCount: totalCount,
          itemsPerPage: ITEMS_PER_PAGE,
          lastPage: Math.ceil(totalCount/ ITEMS_PER_PAGE)
        }
      });
    })
    .catch(error => next(createError(error)));
};

exports.getCart = (request, response, next) => {
  request.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;

      response.render('shop/cart', {
        pageTitle: 'Cart Details',
        items: products
      });
    })
    .catch(error => next(createError(error)));
};

exports.postAddToCart = (request, response, next) => {
  const productId = request.body.productId;

  Product.findById(productId)
    .then(product => {
      request.user.addToCart(product);
      response.redirect('/cart');
    })
    .catch(error => next(createError(error)));
};

exports.postCartDeleteItem = (request, response, next) => {
  const productId = request.body.productId;

  request.user.deleteItemFromCart(productId)
    .then(result => {
      response.redirect('/cart');
    })
    .catch(error => next(createError(error)));
};

exports.getOrders = (request, response, next) => {
  Order.find({"user.userId": request.user._id})
    .then(orders => {
      response.render('shop/orders', {
        pageTitle: 'Orders',
        orders: orders
      });
    })
    .catch(error => next(createError(error)));
};

exports.postCreateOrder = (request, response, next) => {
  request.user.populate('cart.items.productId')
    .then(user => {
      const items = user.cart.items;

      const order = new Order({
        user: {
          email: request.user.email,
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
    .catch(error => next(createError(error)));
};

exports.getInvoice = (request, response, next) => {
  const orderId = request.params.orderId;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(new Error(errors.array()[0].msg));
  }

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }

      if (order.user.userId.toString() !== request.user._id.toString()) {
        return next(new Error('Unauthorized.'));
      }

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposal', 'inline; filename="' + pdfInvoiceGenerator.generateName(orderId) + '"');
      pdfInvoiceGenerator.generate(order, response);
    })
    .catch(error => next(createError(error)));
};

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout'
  });
};

