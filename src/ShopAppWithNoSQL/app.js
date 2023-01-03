const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./../utils/rootDir');
const log = require('./util/log');
const staticPagesController = require('./controllers/static-pages');

const User = require('./models/user');

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
  User.findById('63b428bcf822cd7bb0b00c6e')
    .then(user => {
      request.user = user;
      next();
    })
    .catch(error => log(error));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(staticPagesController.getNotFound);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://readWriteUser:somepassword@nodejs_course_mongodb:27017/nosql_db')
  .then(result => {
    User.findOne()
      .then(user => {
        if (!user) {
          const user = new User({
            name: 'test_user',
            email: 'test@email.com',
            cart: {
              items: []
            }
          });
          user.save();
        }
      });

    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => log(error));

