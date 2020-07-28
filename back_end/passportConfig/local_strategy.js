const users = require('../db/models/user');
const LocalStrategy = require('passport-local').Strategy;

const strategy = new LocalStrategy({usernameField: "username"}, function(username, password, done) {
    users.findOne({username: username}, (err, user) => {
        if(err) return done(err);

        else if(!user)
            return done(null, false, {message: "Incorrect username"});
            
        else if (!user.comparePassword(password)){
            done(null, false, {message: "Incorrect password"});
        }
        else {
            done(null, user);
        }
    });
});

module.exports = strategy;