const router = require("express").Router();
const path = require("path");
const iconv = require("iconv-lite");
const multer = require("multer");

const dbConnect = require("../config/db.config").init();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = path.extname(file.originalname);
    cb(
      null,
      // path.basename(     iconv.decode(file.originalname.replace(/ /g,
      // "").toString(), "UTF-8"),     ext ) + "-" + Date.now() + ext
      path.basename(
        iconv.decode(file.originalname.replace(/ /g, "").toString(), "UTF-8"),
        newFileName
      ) + newFileName
    );
  },
});

//사진 파일
const upload = multer({ storage: storage });

//이미지 파일 불러올 때 Cors 에러 방지
const options = {
  setHeaders: function (res, path, stat) {
    res.set("Access-Control-Allow-Origin", "*");
  },
};

router.get("/getAllRef", (req, res) => {
  const sql =
    "SELECT seq, title, link, writer, menu_type, wri_time, thumbnail FROM podobot.reference";

  dbConnect.query(sql, (err, rows) => {
    if (err) {
      console.log("query is not excuted", err);
      res.send({ result: 4 });
    } else {
      res.send({ result: 0, data: rows });
    }
  });
});

router.post("/postRef", upload.array("file"), async (req, res) => {
  const sql =
    "INSERT INTO podobot.reference(seq, title, link, writer, menu_type, wri_time, thumbnail) " +
    " VALUES(0, ?, ?, ?, ?, NOW(), ?)";

  let param = [
    req.body.title,
    req.body.link,
    req.body.writer,
    req.body.menu_type,
  ];

  req.files.map((data) => {
    param.push(data.filename);
  });

  if (req.files.length === 0) {
    param.push(null);
  }

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