const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv').config();
const connection = require('./db/index');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRET || "HELLO WORLD THIS IS SUPPOSED TO BE A SECRET, BUT IM TESTIN IT",
        store: new MongoStore({ mongooseConnection: connection }),
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


module.exports = app;