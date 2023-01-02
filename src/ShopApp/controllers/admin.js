const Product = require('./../models/product');
const Cart = require('./../models/cart');

exports.getProducts = (request, response, next) => {
  request.user.getProducts()
    .then(products => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list',
        path: request.originalUrl
      });
    })
    .catch(error => console.log(error));
};

exports.getAddProduct = (request, response, next) => {
  response.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (request, response, next) => {
  request.user.createProduct({
    title: request.body.title,
    price: request.body.price,
    imageUrl: request.body.imageUrl,
    description: request.body.description,
  }).then(result => {
    response.redirect('/');
  })
    .catch(error => console.log(error));
};

exports.getEditProduct = (request, response, next) => {
  const productId = request.params.productId;
  const editMode = request.query.edit;

  if (editMode !== 'true') {
    return response.redirect('/admin/products');
  }

  request.user.getProducts({where: {id: productId}})
    .then(products => {
      if (!products[0]) {
        return response.redirect('/admin/products');
      }

      response.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products[0]
      });
    })
    .catch(error => console.log(error));
};

exports.postEditProduct = (request, response, next) => {
  Product.findByPk(request.body.productId)
    .then(product => {
      product.title = request.body.title;
      product.price = request.body.price;
      product.imageUrl = request.body.imageUrl;
      product.description = request.body.description;

      return product.save();
    })
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(result => {
      response.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
      response.redirect('/admin/products');
    });
};
