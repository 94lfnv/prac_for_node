const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.listen(port, () => {
  console.log("Listening on port 3001...");
});

app.use(cors());

const ref = require("./src/routes/reference");
app.use("/ref", ref);
