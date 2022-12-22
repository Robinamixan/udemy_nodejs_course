const Product = require('./../models/product')
const Cart = require('./../models/cart')

exports.getProducts = (request, response, next) => {
  Product.fetchAll((products) => {
    response.render('shop/products-list', {
      products: products,
      pageTitle: 'Products list',
      path: request.url
    });
  });
};

exports.getProductDetails = (request, response, next) => {
  const productId = request.params.productId;

  Product.findById(productId, (product) => {

    response.render('shop/product-details', {
      product: product,
      pageTitle: 'Product details',
      path: request.url
    });
  });
};

exports.getIndex = (request, response, next) => {
  Product.fetchAll((products) => {
    response.render('shop/index', {
      products: products,
      pageTitle: 'Shop Main Page',
      path: request.url
    });
  });
};

exports.getCart = (request, response, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {

      const cartItems = [];
      for (let product of products) {
        const cartItem = cart.items.find(item => item.productId === product.id);
        if (cartItem) {
          cartItems.push({productData: product, quantity: cartItem.quantity});
        }
      }

      response.render('shop/cart', {
        pageTitle: 'Cart Details',
        path: request.url,
        items: cartItems
      });
    });
  });
};

exports.postAddToCart = (request, response, next) => {
  const productId = request.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(product.id, product.price);
  });

  response.redirect('/cart');
};

exports.postCartDeleteItem = (request, response, next) => {
  const productId = request.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(product.id, product.price);
    response.redirect('/cart');
  });
};

exports.getOrders = (request, response, next) => {
  response.render('shop/orders', {
    pageTitle: 'Orders',
    path: request.url
  });
};

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: request.url
  });
};

