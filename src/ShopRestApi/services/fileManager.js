const fs = require('fs');
const path = require('path');
const uploadDir = require('../../utils/uploadDir');

module.exports.deleteFile = (filePath) => {
  const absoluteFilePath = path.join(uploadDir, filePath);

  if(fs.existsSync(absoluteFilePath)){
    fs.unlink(absoluteFilePath, (error) => {
      if (error) {
        throw error;
      }
    });
  }
};