const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../db/models/user');


router.post('/', (req, res, next) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if(err) return res.json({success: false, message: err.message});

        user.comparePassword(req.body.password, (err, result) => {
            if(err) { 
                console.log("error"); 
                return res.json({success: false, message: err.message});
            }
            else return res.json({success: true, user: user.username});
        });
    });
    
});

router.get('/', (req, res, next) => {
    console.log("In backend");
    return res.json({
        message: "Hit Here"
    });
});

module.exports = router;