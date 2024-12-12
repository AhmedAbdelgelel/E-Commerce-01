const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");
const productModel = require("../models/productModel");

// @desc   Get list of products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(productModel, "Product");

// @desc   Get specific product by id
// @route GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(ProductModel);
// @desc   Create Product
// @route POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(productModel);

// @desc   Update specific product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc   Delete specific product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(ProductModel);
