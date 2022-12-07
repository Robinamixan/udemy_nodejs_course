const fs = require('fs');
const path = require('path');

const rootDir = require('./../../../utils/rootDir');

const getProductsFromFile = (callback) => {
  const productsStorage = path.join(rootDir, 'data', 'products.json');

  return fs.readFile(productsStorage, (error, fileContent) => {
    if (error) {
      return callback([]);
    }

    return callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile(products => {
      const productsStorage = path.join(rootDir, 'data', 'products.json');

      products.push(this);
      fs.writeFile(productsStorage, JSON.stringify(products), err => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
