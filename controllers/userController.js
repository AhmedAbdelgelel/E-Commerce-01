const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const factory = require("./handlersFactory");

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .png({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc  Get list of users
// @route GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc  Get specific User by id
// @route GET /api/v1/Users/:id
// @access Private
exports.getUser = factory.getOne(User);
// @desc  Create user
// @route POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);

// @desc   Update specific user
// @route  PUT /api/v1/users/:id
// @access Private
exports.updateUser = factory.updateOne(User);

// @desc   Delete specific user
// @route  DELETE /api/v1/users/:id
// @access Private
// eslint-disable-next-line no-multi-assign
exports.deleteUser = factory.deleteOne(User);
