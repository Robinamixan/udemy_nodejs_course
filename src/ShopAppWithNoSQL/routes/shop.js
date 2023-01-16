const express = require('express');

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

router.post('/create-order', isAuth, shopController.postCreateOrder);

router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router