const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const index = require("./routes/index");

const app = express();

app.use(index);