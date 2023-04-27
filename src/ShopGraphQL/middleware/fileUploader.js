const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'upload');
  },
  filename: (request, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (request, file, callback) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    callback(null, true);
  }

  callback(null, false);
};

module.exports.prepareUploadHandler = (requestFieldName) => {
  return multer({storage: fileStorage, fileFilter: fileFilter}).single(requestFieldName);
};