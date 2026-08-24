const env = require('../config/env');
const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) {
    statusCode = 500;
  }

  const response = {
    success: false,
    error: {
      code: err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR'),
      message: message || 'Internal Server Error',
      details: err.errors || null,
    },
  };

  if (env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
