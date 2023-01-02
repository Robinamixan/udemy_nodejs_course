const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./../utils/rootDir');
const log = require('./util/log');
const staticPagesController = require('./controllers/static-pages');

const User = require('./models/user');

const mongoConnect = require('./util/database').mongoConnect;

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
  User.findById('63b2c4cf3bb30552d5f00d17')
    .then(user => {
      request.user = new User(
        user.name,
        user.email,
        user.cart,
        user._id
      );
      next();
    })
    .catch(error => log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(staticPagesController.getNotFound);

mongoConnect(() => {
  app.listen(process.env.SECOND_INTERNAL_PORT);
});


