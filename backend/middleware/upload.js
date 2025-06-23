// middleware/upload.js
const multer = require('multer');
 
const storage = multer.memoryStorage(); // Store in memory as buffer
 
const upload = multer({
  storage,
 
});
 
module.exports = upload;