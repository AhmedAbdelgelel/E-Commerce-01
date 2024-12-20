const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  const memoryStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };

  const upload = multer({
    storage: memoryStorage,
    fileFilter: multerFilter,
  });

  return upload.single(fieldName);
};
