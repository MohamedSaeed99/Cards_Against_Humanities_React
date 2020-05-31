const express = require('express');
const router = express.Router();
const User = require('../db/models/user')


router.post('/', (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        gameId: null,
        currCards: null
    });

    user.save( (error) => {
        if(error) {
            return res.json({success: false, error: error.message});
        }
        else{

            // Look at passport login function
            // http://www.passportjs.org/docs/login/
            // req.login(user, (err) => {
            //     if(err) {

            //     }
            //     return res.json({success: true, username: user.username})
            // });
        }
    });
});

router.get('/', (req, res, next) => {
    console.log("In backend");
    return res.json({
        message: "Hit Here"
    });
});

module.exports = router;