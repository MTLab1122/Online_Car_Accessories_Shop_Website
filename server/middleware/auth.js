import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Access denied. Please log in to proceed.');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'autox_default_jwt_secret_dev_key'
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account is inactive or suspended. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired session token.');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Access forbidden. Requires ${roles.join(' or ')} permission.`);
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'autox_default_jwt_secret_dev_key'
      );
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch {
    // If token invalid, proceed without authenticated user
    next();
  }
};

