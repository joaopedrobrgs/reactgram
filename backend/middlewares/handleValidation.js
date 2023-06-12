const { validationResult } = require('express-validator');

const validate = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    return res.status(404).json({
      errors: extractedErrors,
    });

  };
};

module.exports = validate;