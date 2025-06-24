const multer = require("multer");
const fileUpload = multer({ storage: multer.memoryStorage() });
module.exports = fileUpload;
