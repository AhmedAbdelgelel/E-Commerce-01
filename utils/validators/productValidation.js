const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");
exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .notEmpty()
    .withMessage("Product must have description")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product must have a price")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")

    // checks if the price after discount lower than the actual price
    .custom((price, { req }) => {
      if (req.body.price <= price) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("Colors must be array"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format")
    // checks if the category id is true
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
    }),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    // Validate subcategory IDs: Fetch matching subcategories from DB and ensure all provided IDs exist
    .custom(async (subcategoriesIds) => {
      const subcategories = await SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoriesIds },
      });
      if (
        subcategories.length === 0 ||
        subcategories.length !== subcategoriesIds.length
      ) {
        throw new Error(`No subcategories for these IDs: ${subcategoriesIds}`);
      }
    })
    // make an empty array and loop over subcategoriesIds to push the IDs into that array
    .custom(async (subcategoriesIds, { req }) => {
      const subcategories = await SubCategoryModel.find({
        category: req.body.category,
      });
      const subCategoriesIdsInDB = [];
      subcategories.forEach((subcategory) => {
        subCategoriesIdsInDB.push(subcategory._id.toString());
      });

      // check if subcategories ids in db include subcategories in req.body (true/false)
      const checker = (target, arr) => target.every((id) => arr.includes(id));
      if (!checker(subcategoriesIds, subCategoriesIdsInDB)) {
        throw new Error(
          `SubCategories not belong to this category id: ${subcategoriesIds}`
        );
      }
    }),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be higher than or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be lower than or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
