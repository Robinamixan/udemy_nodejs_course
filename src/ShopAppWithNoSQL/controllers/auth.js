const bcrypt = require('bcryptjs');

const log = require('../util/log');
const User = require('../models/user');

exports.getSignup = (request, response, next) => {
  response.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    editing: false,
    isAuthenticated: request.session.isLoggedIn
  });
};

exports.postSignup = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const confirmPassword = request.body.confirmPassword;

  User.findOne({email: email})
    .then(user => {
      if (user) {
        return response.redirect('/signup');
      }

      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: {items: []}
          });

          return newUser.save();
        })
        .then(result => {
          response.redirect('/login');
        });
    })
    .catch(error => log(error));
}

exports.getLogin = (request, response, next) => {
  response.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    editing: false,
    isAuthenticated: request.session.isLoggedIn
  });
};


exports.postLogin = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return response.redirect('/login');
      }

      bcrypt.compare(password, user.password)
        .then(doMath => {
          if (doMath) {
            request.session.user = user;
            request.session.isLoggedIn = true;

            return request.session.save(error => {
              if (error) {
                log(error);
              }

              response.redirect('/');
            });
          }

          return response.redirect('/login');
        })
        .catch(error => {
          if (error) {
            console.log(error);
          }
          response.redirect('/login');
        });


    })
    .catch(error => log(error));
};

exports.postLogout = (request, response, next) => {
  request.session.destroy(error => {
    if (error) {
      log(error);
    }
    response.redirect('/');
  });
};
