const passport = require('passport');
const users = require('../db/models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((username, password, done) => {
    users.findOne({username: username}, (err, user) => {
        if(err) return done(err); 
        else if(!user)
            return done(null, false, {message: "Incorrect username"});
        else if (!user.comparePassword(password, (err, result) => {
            if(!result) {
                done(null, false, {message: "Incorrect password"});
            } 
            done(null, user);
        })){
        }
    });
}));