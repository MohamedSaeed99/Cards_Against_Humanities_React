const express = require('express');
const router = express.Router();
const User = require('../db/models/user')
const passport = require('passport');


router.post('/', (req, res, next) => {
    const {username, password} = req.body;

    User.findOne({username: username}, (err, result) => {
        if(err) return res.json({success: false, message: err.message});
        if(result) return res.json({success: false, message: "Username is taken"});

        const user = new User({
            username: username,
            password: password,
            gameId: null,
            currCards: null
        });

        if(!username || username === ""){
            return res.json({success: false, message: "Invalid username"});
        }
        if(!password || password === ""){
            console.log(password)
            return res.json({success: false, message: "Invalid password"});
        }

        user.save( (error) => {
            if(error) {
                return res.json({success: false, message: error.message});
            }
            else{
                // Look at passport login function
                // http://www.passportjs.org/docs/login/
                req.login(user, (err) => {
                    if(err) { res.json({success: false, message: err.message})}
                    return res.json({success: true, user: user.username});
                });
            }
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