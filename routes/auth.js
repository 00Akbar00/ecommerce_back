const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validate.middleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

router.post("/register", registerValidator, validateRequest, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
