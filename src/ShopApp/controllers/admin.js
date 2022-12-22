const Product = require('./../models/product');
const Cart = require('./../models/cart');

exports.getProducts = (request, response, next) => {
  Product.fetchAll()
    .then(([products]) => {
      response.render('admin/products-list', {
        products: products,
        pageTitle: 'Admin products list',
        path: request.url
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
  const product = new Product(
      null,
      request.body.title,
      request.body.imageUrl,
      request.body.description,
      request.body.price
  );

  product.save()
    .then(() => {
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

  Product.findById(productId, product => {
    if (!product) {
      return response.redirect('/admin/products');
    }

    response.render('admin/edit-product', {
      pageTitle: 'Edit product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (request, response, next) => {
  const product = new Product(
      request.body.productId,
      request.body.title,
      request.body.imageUrl,
      request.body.description,
      request.body.price
  );

  product.save()
    .then(() => {
      response.redirect('/admin/products');
    })
    .catch(error => console.log(error));
};

exports.postDeleteProduct = (request, response, next) => {
  const productId = request.body.productId;

  Product.findById(productId, product => {
    if (!product) {
      return response.redirect('/admin/products');
    }

    Product.deleteById(productId);
    Cart.deleteProduct(productId, product.price);

    response.redirect('/admin/products');
  });
};
