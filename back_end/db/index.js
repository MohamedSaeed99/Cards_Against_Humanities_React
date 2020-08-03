const mongoose = require('mongoose');

const uri = `${process.env.MONGODB_URI}`;
// local connection
// const uri = "mongodb://localhost:27017";

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Connected to our Mongo Database");
    })
    .catch((err) => {
        console.log("Error connecting to Mongo: ", err);
});

module.exports = mongoose.connection;