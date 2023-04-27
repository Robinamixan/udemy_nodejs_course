const validator = require('validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = async ({userInput}, request) => {
  const errors = [];
  if (!validator.isEmail(userInput.email)) {
    errors.push({
      message: 'Email is invalid',
    });
  }

  if (validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, {min: 5})) {
    errors.push({
      message: 'Password is invalid',
    });
  }

  if (errors.length > 0) {
    const error = new Error('invalid input');
    error.data = errors;
    error.statusCode = 422;

    throw error;
  }

  const existUser = await User.findOne({email: userInput.email});
  if (existUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(userInput.password, 12);

  const user = new User({
    email: userInput.email,
    name: userInput.name,
    password: hashedPassword,
  });

  await user.save();

  return {
    ...user._doc,
    _id: user._id.toString(),
  };
};