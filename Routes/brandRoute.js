const express = require("express");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidation");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  resizeImage,
  uploadBrandImage,
} = require("../controllers/brandController");
const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
module.exports = router;
