const multer = require('multer');
const { UPLOAD_PATH, MAX_FILE_SIZE } = require('./env');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

module.exports = upload;
