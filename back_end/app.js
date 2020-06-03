const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv').config();
const connection = require('./db/index');
const regRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const lobbyRouter = require('./routes/lobby');
const logoutRouter = require('./routes/logout');
const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SECRET,
        store: new MongoStore({ mongooseConnection: connection }),
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/register", regRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/lobby", lobbyRouter);

module.exports = app;