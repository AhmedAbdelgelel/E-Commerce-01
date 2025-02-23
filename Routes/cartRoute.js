const express = require("express");
const { addProductToCart } = require("../controllers/cartController");
const { protect, allowedTo } = require("../controllers/authController");
const router = express.Router();

router.route("/").post(protect, allowedTo("user"), addProductToCart);

module.exports = router;
