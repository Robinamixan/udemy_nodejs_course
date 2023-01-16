const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./../utils/rootDir');
const log = require('./util/log');
const staticPagesController = require('./controllers/static-pages');

const User = require('./models/user');

const MONGODB_URI = 'mongodb://readWriteUser:somepassword@nodejs_course_mongodb:27017/nosql_db';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csurfProtection = csrf();

// set template engine //
app.set('view engine', 'ejs');
// set folder with templates //
app.set('views', path.join(rootDir, 'views'));
// set body parser for all input requests //
app.use(bodyParser.urlencoded({extended: false}));
// set folder with public files //
app.use(express.static(path.join(rootDir, 'public')));

// initialize session
app.use(session({
  secret: 'test_secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csurfProtection);
app.use(flash());

app.use((request, response, next) => {
  if (!request.session.user) {
    return next();
  }

  User.findById(request.session.user._id.toString())
    .then(user => {
      request.user = user;
      next();
    })
    .catch(error => log(error));
});

app.use((request, response, next) => {
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.csrfToken = request.csrfToken();
  response.locals.path = request.originalUrl;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(staticPagesController.getNotFound);

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => log(error));

