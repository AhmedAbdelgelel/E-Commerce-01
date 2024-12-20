/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const sharp = require("sharp");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");
// 1) DiskStorage engine
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

// 2) Memory storage engine
// const memoryStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCategoryImage = upload.single("image");

// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(600, 600)
//     .toFormat("jpeg")
//     .png({ quality: 90 })
//     .toFile(`uploads/categories/${filename}`);
//   next();
// });

// @desc   Get list of categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(CategoryModel, "Category");

// @desc   Get specific category by id
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc   Create Category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(CategoryModel);

// @desc   Update specific category
// @route  PUT /api/v1/categories
// @access Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc   Delete specific category
// @route  DELETE /api/v1/categories
// @access Private

exports.deleteCategory = factory.deleteOne(CategoryModel);

// exports.deleteCategory = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const category = await CategoryModel.findByIdAndDelete(id);
//   if (!category) {
//     return next(new ApiError(`No category found for this id: ${id}`, 404));
//   }
//   res.status(204).send();
// });
