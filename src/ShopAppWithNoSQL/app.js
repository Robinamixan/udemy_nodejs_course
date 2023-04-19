const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./../utils/rootDir');
const uploadDir = require('./../utils/uploadDir');
const createError = require('./util/createError');
const log = require('./util/log');
const staticPagesController = require('./controllers/static-pages');

const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

const csurfProtection = csrf();

// set template engine //
app.set('view engine', 'ejs');
// set folder with templates //
app.set('views', path.join(rootDir, 'views'));

// set body parser for all input requests //
app.use(bodyParser.urlencoded({extended: false}));

const fileStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'upload');
  },
  filename: (request, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (request, file, callback) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    callback(null, true);
  }

  callback(null, false);
};

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

// set folder with public files //
app.use(express.static(path.join(rootDir, 'public')));
app.use('/upload', express.static(path.join(uploadDir, 'upload')));

// initialize session
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csurfProtection);
app.use(flash());

app.use((request, response, next) => {
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.csrfToken = request.csrfToken();
  response.locals.path = request.path;
  next();
});

app.use((request, response, next) => {
  if (!request.session.user) {
    return next();
  }

  User.findById(request.session.user._id.toString())
    .then(user => {
      if (!user) {
        return next();
      }

      request.user = user;
      next();
    })
    .catch(error => next(createError(error)));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', staticPagesController.get500);

app.use(staticPagesController.getNotFound);

app.use((error, request, response, next) => {
  log(error);

  staticPagesController.get500(request, response, next);
});

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    app.listen(process.env.SECOND_INTERNAL_PORT);
  })
  .catch(error => createError(error));

