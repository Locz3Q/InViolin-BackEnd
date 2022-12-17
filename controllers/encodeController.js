const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler');

const hashPassword = asyncHandler(async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
});

module.exports = {hashPassword};