const { body } = require("express-validator");

// Centralized password rule regex
const PASSWORD_RULES = {
  MIN_LENGTH: 8,
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /\d/,
  SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
};

exports.registerValidator = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isAlpha().withMessage("First name must contain only letters"),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isAlpha().withMessage("Last name must contain only letters"),

  body("email")
    .normalizeEmail()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: PASSWORD_RULES.MIN_LENGTH }).withMessage(`Password must be at least ${PASSWORD_RULES.MIN_LENGTH} characters long`)
    .matches(PASSWORD_RULES.LOWERCASE).withMessage("Password must contain at least one lowercase letter")
    .matches(PASSWORD_RULES.UPPERCASE).withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_RULES.NUMBER).withMessage("Password must contain at least one number")
    .matches(PASSWORD_RULES.SPECIAL_CHAR).withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

exports.loginValidator = [
  body("email")
    .normalizeEmail()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];
