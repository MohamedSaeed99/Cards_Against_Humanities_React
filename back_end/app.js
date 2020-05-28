const express = require("express");
const app = express();
const connection = require('./db/index');
const indexRouter = require("./routes/index");

app.use("/", indexRouter);

module.exports = app;