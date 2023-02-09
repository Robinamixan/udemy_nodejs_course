const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title', 'Please enter valid title with at least 3 characters')
      .trim()
      .isString()
      .isLength({min: 3}),
    body('price', 'Please enter a valid price with decimal points.')
      .isFloat(),
    body('description', 'Please enter valid description.')
      .trim()
      .isLength({min: 5, max: 200})
  ],
  isAuth,
  adminController.postAddProduct
);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post(
  '/edit-product',
  isAuth,
  [
    body('title', 'Please enter valid title with at least 3 characters')
      .trim()
      .isString()
      .isLength({min: 3}),
    body('price', 'Please enter a valid price with decimal points.')
      .isFloat(),
    body('description', 'Please enter valid description.')
      .trim()
      .isLength({min: 5, max: 200})
  ],
  adminController.postEditProduct
);

// /admin/edit-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
