const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get("/", (req, res, next) => {
    console.log("User Logging Out");
    req.logOut();
});

module.exports = router;