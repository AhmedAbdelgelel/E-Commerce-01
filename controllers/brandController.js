const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");
// @desc  Get list of brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(BrandModel, "Brand");

// @desc  Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(BrandModel);
// @desc  Create brand
// @route POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(BrandModel);

// @desc   Update specific brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc   Delete specific brand
// @route  DELETE /api/v1/brands/:id
// @access Private
// eslint-disable-next-line no-multi-assign
exports.deleteBrand = factory.deleteOne(BrandModel);
