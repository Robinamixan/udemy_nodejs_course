const database = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return database.query(
      'INSERT INTO products (title, price, description, imageurl) VALUES (?, ?, ?, ?)',
      [
        this.title,
        this.price,
        this.description,
        this.imageUrl,
      ]
    );
  }

  static deleteById(productId) {

  }

  static fetchAll() {
    return database.query('SELECT * FROM products');
  }

  static findById(productId) {
    return database.query('SELECT * FROM products WHERE products.id=?', [productId]);
  }
};
