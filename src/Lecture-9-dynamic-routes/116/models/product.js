const fs = require('fs');
const path = require('path');

const outputDir = require('./../../../utils/outputDir');
const Cart = require('./cart');

const productsStorage = path.join(outputDir, 'products.json');

const getProductsFromFile = (callback) => {
  return fs.readFile(productsStorage, (error, fileContent) => {
    if (error) {
      return callback([]);
    }

    return callback(JSON.parse(fileContent));
  });
};

const saveToProductsStorage = (products) => {
  fs.writeFile(productsStorage, JSON.stringify(products), err => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id);
        products[existingProductIndex] = this;
      } else {
        this.id = Date.now().toString();
        products.push(this);
      }

      saveToProductsStorage(products);
    });
  }

  static deleteById(productId) {
    getProductsFromFile(products => {
      const updatedProductList = products.filter(product => product.id !== productId);

      saveToProductsStorage(updatedProductList);
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(productId, callback) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === productId);
      callback(product);
    });
  }
};
