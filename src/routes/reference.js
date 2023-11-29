const router = require("express").Router();
const multer = require("multer");
const storage = require("./storage");

const dbConnect = require("../config/db.config").init();

//사진 파일
const upload = multer({ storage: storage });

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
