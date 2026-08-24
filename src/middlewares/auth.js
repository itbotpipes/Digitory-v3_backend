const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated', [{ field: 'token', message: 'Token missing' }]);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // Will attach user info based on token payload (e.g. { id, roleId })
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token', [{ field: 'token', message: error.message }]);
  }
});

module.exports = authenticate;
