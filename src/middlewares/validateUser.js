const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../services/token.service');
const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');
const { userService } = require('../services');

const validateAcc = async (req, res, next) => {
  const token = req.headers['x-auth-token'];

  if (!token) return next(new ApiError(httpStatus.UNAUTHORIZED, 'provide a valid token header'));

  if (typeof token !== 'string') {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'provide a valid token type'));
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);

    const user = await userService.getUserById(payload.sub);
    // add current user to req body
    req.user = user;
    next();
  } catch (e) {
    next(new ApiError(httpStatus.SERVICE_UNAVAILABLE, e.message));
  }
};

module.exports = validateAcc;
