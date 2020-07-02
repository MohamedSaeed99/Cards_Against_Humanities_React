const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    host: {
        type: String,
        required: true,
        unique: true
    },
    czar: {
        type: String,
        required: true,
        unique: false,
    },
    queCard: {
        type: String,
        required: true,
        unique: false
    },
    numOfAnswers: {
        type: Number,
        required: true,
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
    points: {
        type: Array,
        required: true,
        unique: false,
    },
});


module.exports = mongoose.model("Game", gameSchema);