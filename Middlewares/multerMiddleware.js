const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads/'); 
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Please upload the following type of images (jpeg, jpg, png)"), false);
  }
};

const multerConfig = multer({
  storage,
  fileFilter,
});

module.exports = multerConfig;
