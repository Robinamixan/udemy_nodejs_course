const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
  },
});

userSchema.methods.addToCart = function(product) {
  const items = [...this.cart.items];
  const cartProductIndex = items.findIndex(item => {
    return item.productId.toString() === product._id.toString();
  });

  if (cartProductIndex >= 0) {
    items[cartProductIndex].quantity++;
  } else {
    items.push({
      productId: product._id,
      quantity: 1
    });
  }

  this.cart = {items: items};

  return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId) {
  const items = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });

  this.cart = {items: items};

  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = {items: []};

  return this.save();
}

module.exports = mongoose.model('User', userSchema);

//
// class User {
//

//
//   getOrders() {
//     const db = getDb();
//
//     return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray();
//   }
// }
//
// module.exports = User;
