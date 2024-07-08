const { body, inputsValidator } = require("express-validator");

//inputs validator
exports.validateRegisterationInputs = [
  body("fullname")
    .trim()
    .notEmpty("fullname is required")
    .isString("fullname must be a string")
    .isLength({ min: 2, max: 250 }),
    body("email").notEmpty('email is required').isEmail()
];

// sample
const { body, validationResult } = require("express-validator");

// Validation middleware for user input
const validateInputs = () =>[
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid email format"),
  body("firstName").trim().notEmpty().withMessage("First name cannot be empty"),
  body("phone")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number format"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 20 })
    .withMessage("Password cannot be more than 20 characters long"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateInputs,
  handleValidationErrors,
};
