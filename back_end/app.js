const express = require("express");
const app = express();
const connection = require('./db/index');
const indexRouter = require("./routes/register");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/register", indexRouter);

module.exports = app;