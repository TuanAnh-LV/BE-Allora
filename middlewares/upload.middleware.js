const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});
module.exports = upload;
