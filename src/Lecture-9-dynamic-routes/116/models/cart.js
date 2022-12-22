const fs = require('fs');
const path = require('path');

const outputDir = require('./../../../utils/outputDir');

const cartStorage = path.join(outputDir, 'cart.json');

const saveToCartStorage = (cart) => {
  fs.writeFile(cartStorage, JSON.stringify(cart), err => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = class Cart {
  static getCart(callback) {
    return fs.readFile(cartStorage, (error, fileContent) => {
      if (error) {
        callback(null);
      } else {
        const cart = JSON.parse(fileContent);
        callback(cart);
      }
    });
  };

  static addProduct(productId, price) {
    return fs.readFile(cartStorage, (error, fileContent) => {
      let cart = { items: [], totalPrice: 0};
      if (!error) {
        cart = JSON.parse(fileContent);
      }

      const existItemIndex = cart.items.findIndex(item => item.productId === productId);
      const existItem = cart.items[existItemIndex];

      if (existItem) {
        cart.items[existItemIndex] = { ...existItem, quantity: existItem.quantity + 1};
      } else {
        const newItem = { productId: productId, quantity: 1};
        cart.items = [...cart.items, newItem];
      }

      cart.totalPrice = cart.totalPrice + (+price);

      saveToCartStorage(cart);
    });
  }

  static deleteProduct(productId, productPrice) {
    return fs.readFile(cartStorage, (error, fileContent) => {
      if (error) {
        return;
      }

      let cart = JSON.parse(fileContent);

      const deletionItem = cart.items.find(item => item.productId === productId);

      if (!deletionItem) {
        return;
      }

      cart.items = cart.items.filter(item => item.productId !== productId);
      cart.totalPrice = cart.totalPrice - (productPrice * deletionItem.quantity);

      saveToCartStorage(cart);
    });
  };
}
