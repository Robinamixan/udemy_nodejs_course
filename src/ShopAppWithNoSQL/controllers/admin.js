const Product = require('./../models/product');
const log = require('../util/log');

exports.getProducts = (request, response, next) => {
  Product.fetchAll()
    .then(products => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list',
        path: request.originalUrl
      });
    })
    .catch(error => log(error));
};

exports.getAddProduct = (request, response, next) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (request, response, next) => {
  const product = new Product(
    request.body.title,
    request.body.price,
    request.body.description,
    request.body.imageUrl,
    null,
    request.user._id,
  );

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
        product: product
      });
    })
    .catch(error => log(error));
};

exports.postEditProduct = (request, response, next) => {
  const product = new Product(
    request.body.title,
    request.body.price,
    request.body.description,
    request.body.imageUrl,
    request.body.productId,
  );

  product.save()
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => log(error));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.deleteById(productId)
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => {
      log(error);
      response.redirect('/admin/products');
    });
};
