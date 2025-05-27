const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
