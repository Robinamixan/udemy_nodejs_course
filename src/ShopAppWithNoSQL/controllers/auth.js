const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const log = require('../util/log');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getSignup = (request, response, next) => {
  let messages = request.flash('signup_error');
  let errorMessage;
  if (messages.length > 0) {
    errorMessage = messages[0];
  } else {
    errorMessage = null;
  }

  response.render('auth/signup', {
    pageTitle: 'Signup',
    editing: false,
    errorMessage: errorMessage
  });
};

exports.postSignup = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const confirmPassword = request.body.confirmPassword;

  User.findOne({email: email})
    .then(user => {
      if (user) {
        request.flash('signup_error', 'E-Mail exists already, please pick a different one.');

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
        // .then(result => {
        //   return transporter.sendMail({
        //     to: 'robinamixan171@gmail.com',
        //     from: 'learning@learn.com',
        //     subject: 'Signup successful',
        //     html: '<h1>You successfully signup</h1>'
        //   });
        // })
        .then(result => {
          response.redirect('/login');
        });
    })
    .catch(error => log(error));
}

exports.getLogin = (request, response, next) => {
  let messages = request.flash('login_error');
  let errorMessage;
  if (messages.length > 0) {
    errorMessage = messages[0];
  } else {
    errorMessage = null;
  }

  response.render('auth/login', {
    pageTitle: 'Login',
    editing: false,
    errorMessage: errorMessage
  });
};


exports.postLogin = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        request.flash('login_error', 'Invalid email or password.');

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

          request.flash('login_error', 'Invalid email or password.');

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
