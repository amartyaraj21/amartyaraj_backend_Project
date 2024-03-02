const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ApiResponse = require('../utils/ApiResponse');
const secrectkey = 'amartya'

const authMiddleware = async (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return ApiResponse(res, 401, 'Unauthorized - Missing token');
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, secrectkey);
    const user = await User.findById(decoded._id);

    if (!user) {
      return ApiResponse(res, 401, 'Unauthorized - Invalid token');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return ApiResponse(res, 500, 'Internal server error');
  }
};

module.exports = authMiddleware;
