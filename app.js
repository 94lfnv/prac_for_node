const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 3001;

//이미지 파일 불러올 때 Cors 에러 방지
const options = {
  setHeaders: function (res, path, stat) {
    res.set("Access-Control-Allow-Origin", "*");
  },
};

app.use(cors());
app.listen(port, () => {
  console.log("Listening on port 3001...");
});

app.use("/getImgs", express.static(__dirname + "/src/uploads", options));

const ref = require("./src/routes/reference");
app.use("/ref", ref);

const part = require("./src/routes/partners");
app.use("/partners", part);

const prod = require("./src/routes/ourProduct");
app.use("/product", prod);
