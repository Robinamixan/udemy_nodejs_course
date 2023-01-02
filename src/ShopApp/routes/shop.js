const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/add-to-cart', shopController.postAddToCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postCreateOrder);

router.get('/checkout', shopController.getCheckout);

module.exports = router
