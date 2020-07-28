const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get("/", (req, res, next) => {
    if(req.user){
        req.logOut();
        res.send({
            message: "User Logged Out"
        });
    } 
    else {
        res.send({ message: "No user to log out" });
    }
});

module.exports = router;