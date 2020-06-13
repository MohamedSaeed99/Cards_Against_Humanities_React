const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    host: {
        type: String,
        required: true,
        unique: true
    },
    queCard: {
        type: String,
        required: false,
        unique: false
    },
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    players: {
        type: Array,
        required: true,
        unique: true,
    },
});


module.exports = mongoose.model("Game", gameSchema);