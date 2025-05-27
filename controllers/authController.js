const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const sendResponse = (res, status, success, message, data = null) => {
  return res.status(status).json({ success, message, data });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, false, "Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    sendResponse(res, 201, true, "User registered successfully", {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    sendResponse(res, 500, false, "Server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    sendResponse(res, 200, true, "Login successful", {
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    sendResponse(res, 500, false, "Server error");
  }
};

exports.logout = async (req, res) => {
  sendResponse(res, 200, true, "Logout successful");
};
