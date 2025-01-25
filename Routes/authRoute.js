const express = require("express");

const {
  signUpValidator,
  loginValidator,
  // changeUserPasswordValidator,
} = require("../utils/validators/authValidator");

const {
  signUp,
  login,
  forgotPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);

module.exports = router;
