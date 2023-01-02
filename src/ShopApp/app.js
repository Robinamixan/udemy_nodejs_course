const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./../utils/rootDir');
const staticPagesController = require('./controllers/static-pages');

const sequelizeConnection = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// set template engine //
app.set('view engine', 'ejs');
// set folder with templates //
app.set('views', path.join(rootDir, 'views'));
// set body parser for all input requests //
app.use(bodyParser.urlencoded({extended: false}));
// set folder with public files //
app.use(express.static(path.join(rootDir, 'public')));

app.use((request, response, next) => {
  User.findByPk(1)
    .then(user => {
      request.user = user;
      next();
    })
    .catch(error => console.log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(staticPagesController.getNotFound);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

// Sync models and database
// sequelizeConnection.sync({force: true})
sequelizeConnection.sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'dev_user',
        email: 'dev_user@test.com',
      });
    }

    return Promise.resolve(user);
  })
  .then(user => {
    return user.getCart()
      .then(cart => {
        if (!cart) {
          return user.createCart();
        }

        return Promise.resolve(cart);
      });
  })
  .then(cart => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => {
    console.log(error);
  });
