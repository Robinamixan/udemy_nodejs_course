const Product = require('./../models/product');
const log = require('../util/log');

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
    .catch(error => log(error));
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
        editing: editMode,
        product: product
      });
    })
    .catch(error => log(error));
};

exports.postEditProduct = (request, response, next) => {
  const productId = request.body.productId;

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
    .catch(error => log(error));
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
