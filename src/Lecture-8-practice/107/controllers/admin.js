const Product = require('./../models/product')

exports.getAddProduct = (request, response, next) => {
  response.render('admin/add-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product'
  });
};

exports.getProducts = (request, response, next) => {
  Product.fetchAll((products) => {
    response.render('admin/products-list', {
      products: products,
      pageTitle: 'Admin products list',
      path: '/admin/products'
    });
  });
};

exports.postAddProduct = (request, response, next) => {
  const product = new Product(
      request.body.title,
      request.body.imageUrl,
      request.body.description,
      request.body.price
  );
  product.save();
  response.redirect('/');
};
