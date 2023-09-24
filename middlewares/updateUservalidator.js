const Joi = require("@hapi/joi");

const validateUser = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    firstname: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .empty()
      .messages({
        "string.base": "Please provide a valid first name.",
        "string.empty": "First name cannot be empty.",
        "string.regex.base": "First name should only contain letters.",
      }),
    lastname: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .empty()
      .messages({
        "string.base": "Please provide a valid last name.",
        "string.empty": "Last name cannot be empty.",
        "string.regex.base": "Last name should only contain letters.",
      }),
      phoneNumber: Joi.string()
      .regex(/^\d{11}$/) // Validates exactly 11 numeric digits
      .required()
      .messages({
        "string.base": "Please provide a phone number.",
        "string.empty": "Please provide a phone number.",
        "string.pattern.base": "Phone number should be exactly 11 digits with no spaces.",
      }),
  });

  // Validate the request body against the schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If there's a validation error, return a response with the error details
  if (error) {
    const errorMessage = error.details.map((err) => err.message).join(" ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};

module.exports = { validateUser };