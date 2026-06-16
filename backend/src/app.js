const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/", router);

app.get("/", (req, res) => {
  res.send("Lead CRM API running");
});

module.exports = app;
