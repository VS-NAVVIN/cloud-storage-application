const multer = require('multer');
const storage = multer.memoryStorage(); // for S3
const upload = multer({ storage });

module.exports = upload;
