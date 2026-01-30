const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

//diskstorage 
const storage = multer.diskStorage({
  //In this code we can setup a file folder.
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  //In this code we can setup a file name.
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, name) {
      const fn = name.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    })
  }
})
//export upload variable 
const upload = multer({ storage: storage });

//we can used they upload variable.
module.exports = upload; 