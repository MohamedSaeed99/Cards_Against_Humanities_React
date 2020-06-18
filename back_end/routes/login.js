const express = require('express');
const passport = require('../passportConfig');
const router = express.Router();


router.post('/', (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if(err) return next(err);
        if(!user) {
            return res.json({
                message: info.message
            });
        }
        else{
            req.login(user, (err) => {
                if(err) return next(err);
                return res.json({user: user.username, success: true});
            });
        }
    })(req, res, next);    
});

router.get('/', (req, res, next) => {
    console.log("In backend");
    return res.json({
        message: "Hit Here"
    });
});

module.exports = router;