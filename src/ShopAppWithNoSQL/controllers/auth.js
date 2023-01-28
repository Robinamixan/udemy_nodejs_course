const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const log = require('../util/log');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
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

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

  bcrypt.hash(password, 12)
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

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).render('auth/login', {
      pageTitle: 'Login',
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

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

exports.getReset = (request, response, next) => {
  let messages = request.flash('reset_error');
  let errorMessage;
  if (messages.length > 0) {
    errorMessage = messages[0];
  } else {
    errorMessage = null;
  }

  response.render('auth/reset', {
    pageTitle: 'Reset',
    editing: false,
    errorMessage: errorMessage
  });
};

exports.postReset = (request, response, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      log(error)
      return response.redirect('/reset');
    }

    const token = buffer.toString('hex');
    User.findOne({email: request.body.email})
      .then(user => {
        if (!user) {
          request.flash('reset_error', 'No account with this email found.');
          return response.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 7200000;
        return user.save();
      })
      // .then(result => {
      //   return transporter.sendMail({
      //     to: request.body.email,
      //     from: 'learning@learn.com',
      //     subject: 'Reset password',
      //     html: `
      //       <p>You requested a password reset</p>
      //       <p>Click this <a href="http://localhost:49161/reset/${token}">link</a> to set new password</p>
      //     `
      //   });
      // })
      .then(result => {
        log(`http://localhost:49161/reset/${token}`);
        response.redirect('/');
      })
      .catch(error => log(error));
  });
};

exports.getNewPassword = (request, response, next) => {
  const token = request.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()}
  })
    .then(user => {
      if (!user) {
        return next();
      }

      let messages = request.flash('new_password_error');
      let errorMessage;
      if (messages.length > 0) {
        errorMessage = messages[0];
      } else {
        errorMessage = null;
      }

      response.render('auth/new-password', {
        pageTitle: 'New password',
        editing: false,
        errorMessage: errorMessage,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(error => log(error));
};

exports.postNewPassword = (request, response, next) => {
  const userId = request.body.userId;
  const newPassword = request.body.password;
  const passwordToken = request.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
    .then(user => {
      resetUser = user;

      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;

      return resetUser.save();
    })
    .then(result => {
      response.redirect('/login');
    })
    .catch(error => log(error));
};
