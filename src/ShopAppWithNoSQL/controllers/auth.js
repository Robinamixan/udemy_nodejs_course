const log = require('../util/log');
const User = require('../models/user');

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

  User.findById('63b428bcf822cd7bb0b00c6e')
    .then(user => {
      request.session.user = user;
      request.session.isLoggedIn = true;
      request.session.save(error => {
        if (error) {
          log(error);
        }

        response.redirect("/");
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
