const { validationResult } = require('express-validator');

const Product = require('./../models/product');
const log = require('../util/log');
const file = require('../util/file');
const createError = require('../util/createError');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (request, response, next) => {
  const page = +request.query.page || 1;
  let totalCount = 0;

  Product.countDocuments()
    .then(count => {
      totalCount = count;

      return Product.find({userId: request.user._id})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list',
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

  if (!request.file) {
    return response.status(422).render('admin/edit-product', {
      pageTitle: 'Add product',
      editing: false,
      errorMessage: 'Attach file is not an image',
      validationErrors: [],
      product: {...request.body}
    });
  }

  const imageUrl = request.file.path;

  const product = new Product({
    title: request.body.title,
    price: request.body.price,
    description: request.body.description,
    imageUrl: imageUrl,
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
      if (request.file) {
        file.deleteFile(product.imageUrl);
        product.imageUrl = request.file.path;
      }

      return product.save().then(result => {
        response.redirect('/admin/products');
      });
    })
    .catch(error => next(createError(error)));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return new Error('Product not found.');
      }

      file.deleteFile(product.imageUrl);
      return Product.deleteOne({
        _id: productId,
        userId: request.user._id
      })
    })
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => {
      log(error);
      response.redirect('/admin/products');
    });
};
