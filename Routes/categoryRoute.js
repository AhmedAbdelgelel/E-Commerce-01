const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidation");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
} = require("../controllers/categoryController");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();
router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(uploadCategoryImage, createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
