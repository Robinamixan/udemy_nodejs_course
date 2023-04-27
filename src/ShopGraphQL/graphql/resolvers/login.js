const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = async ({email, password}, request) => {
  const user = await User.findOne({email: email});

  if (!user) {
    const error = new Error('User was not found.');
    error.statusCode = 401;

    throw error;
  }

  const isEqualPassword = await bcrypt.compare(password, user.password);
  if (!isEqualPassword) {
    const error = new Error('Wrong password.');
    error.statusCode = 401;

    throw error;
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET_KEY,
    {expiresIn: '1h'}
  );

  return {
    token: token,
    userId: user._id.toString(),
  }
};