const multer = require("multer");
const path = require("path");
const moment = require("moment");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = path.extname(file.originalname);
    cb(
      null,
      path.basename(file.originalname, newFileName) +
        "-" +
        moment(Date.now()).format("HHmmss") +
        newFileName
    );
  },
});

module.exports = storage;
