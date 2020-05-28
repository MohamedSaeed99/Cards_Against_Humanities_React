const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const salt_work_factor = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    }
});

// Hashes password before storing it in db
userSchema.pre('save', (next) =>{
    if(!this.isModified('password')) return next();

    bcrypt.genSalt(salt_work_factor, (err, salt) => {
        if (err) return next(err);
        
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) return next(err);
        
            this.password = hash;
            next();
        });
    });
});

// Function to compare password with hashed
userSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, result) => {
        if(err) return cb(err);
        cb(null, result);
    })
}

module.exports = mongoose.model("User", userSchema);