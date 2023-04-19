const express = require('express');
const { param } = require('express-validator');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.get('/cart', isAuth, shopController.getCart);

router.post('/add-to-cart', isAuth, shopController.postAddToCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);

router.get('/orders', isAuth, shopController.getOrders);

router.get(
  '/orders/:orderId/invoice',
  isAuth,
  [
    param('orderId', 'Not valid order id.')
      .trim()
      .isString()
      .isLength({min: 24, max: 24}),
  ],
  shopController.getInvoice
);

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router
