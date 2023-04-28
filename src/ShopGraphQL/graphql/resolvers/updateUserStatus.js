const {assertUserExist, assertUserAuthorized} = require('../../util/assert');

const User = require('../../models/user');

module.exports = async ({id, status}, request) => {
  assertUserAuthorized(request);

  const user = await User.findById(id);
  assertUserExist(user);

  user.status = status;
  await user.save();

  return {
    ...user._doc,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};