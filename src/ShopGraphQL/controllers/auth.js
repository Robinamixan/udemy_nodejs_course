const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;
  const name = request.body.name;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });

    await user.save();

    response.status(201).json({
      message: 'User created!',
      userId: user._id,
    });
  } catch (error) {
    next(error)
  }
};

exports.login = async (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  try {
    const user = await User.findOne({email: email});

    if (!user) {
      const error = new Error('User was not found.');
      error.statusCode = 401;

      next(error);
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);
    if (!isEqualPassword) {
      const error = new Error('Wrong password.');
      error.statusCode = 401;

      next(error);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'}
    );

    response.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserStatus = async (request, response, next) => {
  const userId = request.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User was not found.');
      error.statusCode = 401;

      next(error);
    }

    response.status(200).json({
      userId: user._id.toString(),
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (request, response, next) => {
  const userId = request.userId;
  const status = request.body.status;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User was not found.');
      error.statusCode = 401;

      next(error);
    }

    user.status = status;
    await user.save();

    response.status(200).json({
      userId: user._id.toString(),
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};