const Product = require('./../models/product');

exports.getProducts = (request, response, next) => {
  request.user.getProducts()
    .then(products => {
      response.render('shop/products-list', {
        products: products,
        pageTitle: 'Products list',
        path: request.originalUrl,
      });
    })
    .catch(error => console.log(error));
};

exports.getProductDetails = (request, response, next) => {
  const productId = request.params.productId;

  Product.findByPk(productId)
    .then(product => {
      response.render('shop/product-details', {
        product: product,
        pageTitle: 'Product details',
        path: request.originalUrl,
      });
    })
    .catch(error => console.log(error));
};

exports.getIndex = (request, response, next) => {
  request.user.getProducts()
    .then(products => {
      response.render('shop/index', {
        products: products,
        pageTitle: 'Shop Main Page',
        path: request.originalUrl,
      });
    })
    .catch(error => console.log(error));
};

exports.getCart = (request, response, next) => {
  request.user.getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      response.render('shop/cart', {
        pageTitle: 'Cart Details',
        path: request.originalUrl,
        items: products,
      });
    })
    .catch(error => console.log(error));
};

exports.postAddToCart = (request, response, next) => {
  const productId = request.body.productId;

  request.user.getCart()
    .then(cart => {
      cart.getProducts({where: {id: productId}})
        .then(products => {
          if (products.length > 0) {
            const product = products[0];
            cart.addProduct(product, {through: {quantity: product.cartItem.quantity + 1}});
          } else {
            Product.findByPk(productId)
              .then(product => {
                cart.addProduct(product, {through: {quantity: 1}});
              })
              .catch(error => console.log(error));
          }

          response.redirect('/cart');
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteItem = (request, response, next) => {
  const productId = request.body.productId;

  request.user.getCart()
    .then(cart => {
      return cart.getProducts({where: {id: productId}});
    })
    .then(products => {
      if (products.length > 0) {
        return products[0].cartItem.destroy();
      }

      return {}
    })
    .then(result => {
      response.redirect('/cart');
    })
    .catch(error => console.log(error));
};

exports.getOrders = (request, response, next) => {
  request.user.getOrders({include: ['products']})
    .then(orders => {
      response.render('shop/orders', {
        pageTitle: 'Orders',
        path: request.originalUrl,
        orders: orders
      });
    })
    .catch(error => console.log(error));
};

exports.postCreateOrder = (request, response, next) => {
  let fetchedCart;

  request.user.getCart()
    .then(cart => {
      fetchedCart = cart;

      return cart.getProducts();
    })
    .then(products => {
      return request.user.createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem = {quantity: product.cartItem.quantity};

            return product;
          }));
        })
        .catch(error => console.log(error));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      response.redirect('/orders');
    })
    .catch(error => console.log(error));
};

exports.getCheckout = (request, response, next) => {
  response.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: request.originalUrl,
  });
};

