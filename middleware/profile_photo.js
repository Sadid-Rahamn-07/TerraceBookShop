const fs = require('fs');
const multer = require('multer');
const path = require('path');
  const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images/user_profile_photos',
    filename: function (req, file, cb) {
        console.log('Saving file for user:', req.session.user); // Add this line
      userid = req.session.user.user_id;
      const dir = path.join(__dirname, '../public/images/user_profile_photos');
      const possibleOldFiles = [
        path.join(dir, `user_${userid}.jpg`),
        path.join(dir, `user_${userid}.png`)
      ];
      possibleOldFiles.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file); // delete regardless of extension
        }
      });
      var ext = file.mimetype === 'image/png' ? '.png' : '.jpg';
      var filename = 'user_' + req.session.user.user_id + ext;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 1 * 1024 * 1024
  }
});

module.exports = upload;