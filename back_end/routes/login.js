const express = require('express');
const passport = require('../passportConfig');
const User = require('../db/models/user');
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
            req.logIn(user, (err) => {
                if(err) return next(err);
                return res.json({user: req.user.username, success: true});
            });
        }
    })(req, res, next);    
});

router.get('/', (req, res) => {
    if(req.user){
        User.findOne({username: req.user.username}, (err, response) => {
            if(err) {
                throw err;
            }
            return res.json({
                user: response,
                isAuth: true
            });
        });
    }
    else {
        return res.json({
            user: null,
            isAuth: false
        });
    }
});

module.exports = router;