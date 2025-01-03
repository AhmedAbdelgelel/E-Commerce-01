const express = require("express");

const {
  signUpValidator,
  loginValidator,
  // changeUserPasswordValidator,
} = require("../utils/validators/authValidator");

const { signUp, login } = require("../controllers/authController");
const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/login").post(loginValidator, login);

module.exports = router;
