const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
const log = require('../util/log');

const _COLLECTION_NAME = 'products';

module.exports = class Product {
  constructor(title, price, description, imageUrl, _id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let query;

    if (this._id) {
      query = db.collection(_COLLECTION_NAME).updateOne(
        {_id: new mongodb.ObjectId(this._id)},
        {$set: this}
      );
    } else {
      query = db.collection(_COLLECTION_NAME).insertOne(this);
    }

    return query
      .then(result => {})
      .catch(error => log(error));
  }

  static fetchAll() {
    const db = getDb();

    return db.collection(_COLLECTION_NAME)
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(error => log(error));
  }

  static findById(productId) {
    const db = getDb();

    return db.collection(_COLLECTION_NAME)
      .find({_id: new mongodb.ObjectId(productId)})
      .next()
      .then(product => {
        return product;
      })
      .catch(error => log(error));
  }

  static deleteById(productId) {
    const db = getDb();

    return db.collection(_COLLECTION_NAME).deleteOne(
      {_id: new mongodb.ObjectId(productId)}
    )
      .then(result => {})
      .catch(error => log(error));
  }
};
