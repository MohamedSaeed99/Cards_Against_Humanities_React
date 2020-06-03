const passport = require('passport');
const User = require('../db/models/user');
const LocalStrategy = require('./local_strategy');

passport.serializeUser( (user, done) => { 
    done(null, {_id: user._id});
});

passport.deserializeUser( (id, done) => {
    User.findOne({_id: id}, "username", (err, user) => {
        done(err, user);
    });
});


module.exports = passport;
