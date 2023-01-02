const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;
const log = require('../util/log');
const {products} = require('../../Lecture-6-templates/79/routes/admin');

const _COLLECTION_NAME = 'users';

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }

  save() {
    const db = getDb();

    return db.collection(_COLLECTION_NAME).insertOne(this);
  }

  static findById(userId) {
    const db = getDb();

    return db.collection(_COLLECTION_NAME)
      .findOne({_id: new mongodb.ObjectId(userId)});
  }

  addToCart(product) {
    const items = [...this.cart.items];
    const cartProductIndex = items.findIndex(item => {
      return item.productId.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
      items[cartProductIndex].quantity++;
    } else {
      items.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1
      });
    }

    const cart = {items: items};

    const db = getDb();
    db.collection(_COLLECTION_NAME).updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      {$set: {cart: cart}}
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    });

    return db.collection('products')
      .find({_id: {$in: productIds}})
      .toArray()
      .then(products => {
        return products.map(product => {
          return {
            ...product,
            quantity: this.cart.items.find(item => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const items = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();

    return db.collection(_COLLECTION_NAME).updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      {$set: {cart: {items: items}}}
    );
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        };

        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = {items: []};

        return db.collection(_COLLECTION_NAME).updateOne(
          {_id: new mongodb.ObjectId(this._id)},
          {$set: {cart: {items: []}}}
        );
      });
  }

  getOrders() {
    const db = getDb();

    return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray();
  }
}

module.exports = User;
