const mongoose = require('mongoose');

const uri = "";

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to our Mongo Database");
    })
    .catch((err) => {
        console.log("Error connecting to Mongo: ", err);
});

module.exports = mongoose.connection;