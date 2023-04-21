const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const name = request.body.name;

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });

      return user.save();
    })
    .then(result => {
      response.status(201).json({
        message: 'User created!',
        userId: result._id,
      });
    })
    .catch(error => next(error));
};

exports.login = (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  let loadedUser;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        const error = new Error('User was not found.');
        error.statusCode = 401;

        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqualPassword => {
      if (!isEqualPassword) {
        const error = new Error('Wrong password.');
        error.statusCode = 401;

        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1h'}
      );

      response.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch(error => next(error));
};