const Joi = require("@hapi/joi");

const validationMiddleware = (req, res, next) => {
  // Define the validation schema using Joi
  const schema = Joi.object({
    firstname: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .required()
      .messages({
        "string.base": "Please provide your first name.",
        "string.empty": "Please provide your first name.",
        "string.regex.base": "First name should only contain letters.",
      }),
    lastname: Joi.string()
      .regex(/^[A-Za-z]+$/)
      .trim()
      .required()
      .messages({
        "string.base": "Please provide your last name.",
        "string.empty": "Please provide your last name.",
        "string.regex.base": "Last name should only contain letters.",
      }),
    email: Joi.string().email().trim().required().messages({
      "string.base": "Please provide your email address.",
      "string.email": "Please provide a valid email address.",
      "string.empty": "Please provide your email address.",
    }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$"))
      .required()
      .messages({
        "string.base": "Please provide a password.",
        "string.empty": "Please provide a password.",
        "string.pattern.base":
          "Password must be at least 8 characters long and include one uppercase letter and one special character (!@#$%^&*).",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "string.empty": "Please confirm your password.",
      }), // Must match the 'password' field, and it's required
      phoneNumber: Joi.string()
      .regex(/^\d{10}$/) // Validates exactly 11 numeric digits
      .required()
      .trim()
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
    return res.status(400).json({ message: errorMessage });
  }

  // If validation is successful, move to the next middleware
  next();
};

module.exports = { validationMiddleware };


