const Product = require('./../models/product');
const log = require('../util/log');

exports.getProducts = (request, response, next) => {
  Product.find()
    // .select('title price')
    // .populate('userId', 'name')
    .then(products => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list',
        path: request.originalUrl,
        isAuthenticated: request.session.isLoggedIn
      });
    })
    .catch(error => log(error));
};

exports.getAddProduct = (request, response, next) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: request.session.isLoggedIn
  });
};

exports.postAddProduct = (request, response, next) => {
  const product = new Product({
    title: request.body.title,
    price: request.body.price,
    description: request.body.description,
    imageUrl: request.body.imageUrl,
    userId: request.user
  });

  product.save()
    .then(result => {
      response.redirect('/');
    })
    .catch(error => log(error));
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
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: request.session.isLoggedIn
      });
    })
    .catch(error => log(error));
};

exports.postEditProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.findById(productId)
    .then(product => {
      product.title = request.body.title;
      product.price = request.body.price;
      product.description = request.body.description;
      product.imageUrl = request.body.imageUrl;

      return product.save();
    })
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => log(error));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.findByIdAndRemove(productId)
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => {
      log(error);
      response.redirect('/admin/products');
    });
};
