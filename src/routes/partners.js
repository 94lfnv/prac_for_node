const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const moment = require("moment");

const dbConnect = require("../config/db.config").init();

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

//사진 파일
const upload = multer({ storage: storage });

router.get("/getAllPart", (req, res) => {
  const sql =
    "SELECT seq, com_type, com_name, com_intro, com_link, writer, wri_time, thumbnail FROM podobot.partners";

  dbConnect.query(sql, (err, rows) => {
    if (err) {
      console.log("query is not excuted", err);
      res.send({ result: 4 });
    } else {
      res.send({ result: 0, data: rows });
    }
  });
});

router.post("/postPart", upload.array("file"), async (req, res) => {
  const sql =
    "INSERT INTO podobot.partners(seq, com_type, com_name, com_intro, com_link, writer, wri_time, thumbnail) " +
    " VALUES(0, ?, ?, ?, ?, ?, NOW(), ?)";

  let param = [
    req.body.com_type,
    req.body.com_name,
    req.body.com_intro,
    req.body.com_link,
    req.body.writer,
  ];

  req.files.map((data) => {
    if (data.length === 0) {
      param.push(null);
    } else {
      param.push(data.filename);
    }
  });

  dbConnect.query(sql, param, (err, rows, fields) => {
    if (err) {
      console.log("query is not excuted", err);
      res.send({ result: 4 });
    } else {
      res.send({ result: 0 });
    }
  });
});

module.exports = router;
