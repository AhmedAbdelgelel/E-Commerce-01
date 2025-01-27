const express = require("express");

// const {
//   getBrandValidator,
//   createBrandValidator,
//   updateBrandValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidation");
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, allowedTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowedTo("user"), createReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, allowedTo("user"), updateReview)
  .delete(protect, allowedTo("admin", "user", "manager"), deleteReview);
module.exports = router;
