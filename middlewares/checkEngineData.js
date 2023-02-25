const createHttpError = require('http-errors');
const Joi = require('joi');
//* Include all validators in that dir.
const engineValidators = require('../validators/engine.validator');

// factory function to create middleware
async function checkEngineData(req, res, next) {
  try {
    const validated = await engineValidators().validateAsync(req.body);
    req.body = validated;
    next();
  } catch (err) {
    //* Pass error to next, to alert the user
    // If validation error occurs call next with HTTP 422.
    // 422 is entity unknown, Otherwise HTTP 500
    if (err.isJoi) return next(createHttpError(422, { message: err.message }));
    next(createHttpError(500));
  }
}

module.exports = { checkEngineData };
