const express = require("express");
const path = require("path");
const cors = require("cors");
const iconv = require("iconv-lite");
const multer = require("multer");
var bodyParser = require("body-parser");
const app = express();
const port = 3001;

//db연결정보
const dbConfig = require(__dirname + "/src/config/db.config.js");
//mysql 실질적으로 연결
const dbConnect = dbConfig.init();

app.get("/", (req, res) => {
  res.send("Hello Node.js. It's me ! !! !!!");
});

app.listen(port, () => {
  console.log("Listening on port 3001...");
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads/");
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
var upload = multer({ storage: storage });

//이미지 파일 불러올 때 Cors 에러 방지
var options = {
  setHeaders: function (res, path, stat) {
    res.set("Access-Control-Allow-Origin", "*");
  },
};

app.use(cors());

app.get("/ref/getAllRef", (req, res) => {
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

app.post("/ref/postRef", upload.array("file"), async (req, res) => {
  const sql =
    "INSERT INTO podobot.reference(seq, title, link, writer, menu_type, wri_time, thumbnail) " +
    " VALUES(0, ?, ?, ?, ?, NOW(), ?)";

  console.log(req.body.data, "222222222222222222");

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
