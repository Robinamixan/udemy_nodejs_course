const { validationResult } = require('express-validator');

const Product = require('./../models/product');
const log = require('../util/log');
const createError = require('../util/createError');

exports.getProducts = (request, response, next) => {
  Product.find({userId: request.user._id})
    // .select('title price')
    // .populate('userId', 'name')
    .then(products => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list'
      });
    })
    .catch(error => next(createError(error)));
};

exports.getAddProduct = (request, response, next) => {
  if (!request.session.isLoggedIn) {
    return next();
  }

  response.render('admin/edit-product', {
    pageTitle: 'Add product',
    editing: false
  });
};

exports.postAddProduct = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {...request.body}
    });
  }

  console.log(request.file);

  const product = new Product({
    title: request.body.title,
    price: request.body.price,
    description: request.body.description,
    image: request.body.image,
    userId: request.user
  });

  product.save()
    .then(result => {
      response.redirect('/');
    })
    .catch(error => next(createError(error)));
};

exports.getEditProduct = (request, response, next) => {
  const productId = request.params.productId;
  const editMode = request.query.edit;

  if (editMode !== 'true') {
    return response.redirect('/admin/products');
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return response.redirect('/admin/products');
      }

      response.render('admin/edit-product', {
        pageTitle: 'Edit product',
        editing: true,
        product: product
      });
    })
    .catch(error => next(createError(error)));
};

exports.postEditProduct = (request, response, next) => {
  const productId = request.body.productId;

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Edit product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {...request.body, _id: productId}
    });
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== request.user._id.toString()) {
        return response.redirect('/');
      }

      product.title = request.body.title;
      product.price = request.body.price;
      product.description = request.body.description;
      product.imageUrl = request.body.imageUrl;

      return product.save().then(result => {
        response.redirect('/admin/products');
      });
    })
    .catch(error => next(createError(error)));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.deleteOne({
    _id: productId,
    userId: request.user._id
  })
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => {
      log(error);
      response.redirect('/admin/products');
    });
};
