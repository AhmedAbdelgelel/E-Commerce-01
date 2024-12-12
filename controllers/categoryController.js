const factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");

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
