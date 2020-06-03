const express = require('express');
const dotenv = require('dotenv').config();
const connection = require('./db/index');
const regRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SECRET,
        store: new MongoStore({ mongooseConnection: connection }),
        resave: false,
        saveUninitialized: false,
    })
);
app.use("/register", regRouter);
app.use("/login", loginRouter);

module.exports = app;