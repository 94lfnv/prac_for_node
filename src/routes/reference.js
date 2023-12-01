const router = require("express").Router();
const multer = require("multer");
const storage = require("./storage");
var ffmpeg = require("fluent-ffmpeg");

const dbConnect = require("../config/db.config").init();

//사진 파일
const upload = multer({ storage: storage });

router.get("/getAllRef", (req, res) => {
  const sql = "SELECT * FROM podobot.reference";

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
    "INSERT INTO podobot.reference(seq, title, writer, menu_type, brand_type, wri_time, video, thumbnail) " +
    " VALUES(0, ?, ?, ?, ?, NOW(), ?, ?)";

  let param = [
    req.body.title,
    req.body.writer,
    req.body.menu_type,
    req.body.brand_type,
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

const videoUpload = multer({ storage }).single("file");

// 서버에 비디오 업로드
router.post("/videoUpload", (req, res) => {
  console.log(req, "??????????reqqqq");
  console.log(videoUpload, "videoUploaddddd");
  videoUpload(req, res, (err) => {
    if (err) {
      return res.json({ result: 4, err });
    }
    return res.json({
      result: 0,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

// 썸네일 포스트
router.post("/thumbnail", (req, res) => {
  let thumbnailPath = "";

  ffmpeg.ffprobe(req.body.url, (err, data) => {
    console.dir(data, "????????????");
    console.log(data.format, "formatttttttt");
  });

  ffmpeg(req.body.url)
    .on("filenames", (filenames) => {
      console.log(filenames, "?????filenames");
      thumbnailPath = "src/uploads/thumbs/" + filenames[0];
    })
    .on("end", () => {
      return res.json({
        result: 0,
        thumbnailPath: thumbnailPath,
      });
    })
    .on("error", (err) => {
      return res.json({ result: 4, err });
    })
    .screenshots({
      count: 1,
      folder: "src/uploads/thumbnails",
      size: "320X200",
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
