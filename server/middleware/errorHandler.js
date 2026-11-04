import { errorResponse } from '../utils/apiResponse.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose bad ObjectId CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid identifier format: ${err.value}`;
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. It must be unique.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Data validation failed';
    errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // In development, log error stack
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error Handler]`, err);
  }

  return errorResponse(
    res,
    statusCode,
    message,
    errors.length > 0 ? errors : (process.env.NODE_ENV === 'development' ? err.stack : undefined)
  );
};

