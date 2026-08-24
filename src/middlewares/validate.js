const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.param || err.path,
    message: err.msg,
  }));

  const apiError = new ApiError(400, 'Invalid request payload', extractedErrors);
  apiError.code = 'VALIDATION_FAILED';
  
  return next(apiError);
};

module.exports = validate;
