const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

// @desc   Signup
// @route  GET /api/v1/auth/signup
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate JWT
  const token = generateToken(user._id);

  res.status(201).json({
    user,
    token,
  });
});
exports.login = asyncHandler(async (req, res, next) => {
  // 1- check if there are password and email in the body(validation)
  // 2- check if user exists and check if password is correct
  const user = await User.findOne({ email: req.body.email });
  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!user || !isCorrectPassword) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 3- generate token
  const token = generateToken(user._id);
  // 4- send response to clint side
  res.status(200).json({
    user,
    token,
  });
});

// @desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- check if token exists, if exists get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    next(
      new ApiError(
        "You are not login, please login to get access this route",
        401
      )
    );
  }

  // 2- verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3- check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exists",
        401
      )
    );
  }
  // 4- check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed after token created (Error)
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password please login again",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});
// @desc Authorization (User Permissions)
// ["admin","manager"]
exports.allowedTo = (...roles) =>
  // 1) access roles
  // 2) access registered user (req.user.role)
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("You are not allowed access this route", 403));
    }
    next();
  });

// @desc   Forgot password
// @route  Post /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`)
    );
  }
  // 2) If user exists, Generate hashed reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  await user.save();

  // 3) Send the reset code via email
});
