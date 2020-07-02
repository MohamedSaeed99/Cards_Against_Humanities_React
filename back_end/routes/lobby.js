const express = require('express');
const router = express.Router();
const Game = require('../db/models/games');
const User = require('../db/models/user');
const cardParser = require("../cards/file_parser")
const crypto = require("crypto");

// gets a random question card
const randQueCard = () => {
    return cardParser.queCards[Math.floor(Math.random() * cardParser.queCards.length)]
}

// gets 6 randome answer cards
const randAnsCards = (current=0) => {
    // Calculates how many cards the user needs, total should be 6 cards
    var amountNeeded = 6 - current;
    var cards = [];

    for(var i = 0; i < amountNeeded; i++){
        cards.push(cardParser.ansCards[Math.floor(Math.random() * cardParser.ansCards.length)]);
    }

    return cards;
}


// creates the lobby
router.post('/', (req, res, next) => {
    if(req.isAuthenticated()) {

        const randCard = randQueCard();

        const game = new Game({
            host: req.body.username,
            czar: req.body.username,
            gameId: crypto.randomBytes(20).toString('hex'),
            players: [req.body.username],
            queCard: randCard[0],
            numOfAnswers: randCard[1],
            points: [0]
        });

        game.save( (error) => {
            if(error) {
                return res.json({success: false, message: error.message});
            }
            else{
                const ansCards = randAnsCards();
                // updates the host with the gameid they created
                User.update({username: req.body.username}, {$set: {gameId: game.gameId, currCards: ansCards}}, (err) => {
                    if(err){
                        console.log(err.message);
                        throw err;
                    }
                    else {
                        return res.json({
                            success:true, 
                            gameId: game.gameId, 
                            queCards: game.queCard, 
                            numOfAnswers: game.numOfAnswers,
                            ansCards: ansCards,
                        });
                    }
                });
            }
        });
    }
});


// adds user to a lobby
router.put('/add', (req, res, next) => {
    if(req.isAuthenticated()){

        const ansCards = randAnsCards();

        // updates the user of the gameid they joined
        User.update({username: req.body.username}, {$set: {gameId: req.body.lobbyId, currCards: ansCards}}, (err) => {
            if(err){
                console.log(err.message);
                return res.json({success: false, message: err.message});
            }
            else{
                // updates the game of the new user that joined
                Game.update (
                    { gameId: req.body.lobbyId }, 
                    { $addToSet: { players: req.body.username },
                    $push: { points: 0 }}, (err, result) => {
                        if(err){
                            console.log(err.message);
                            return res.json({success: false, message: err.message});
                        }
                        else{
                            return res.json({
                                success: true, 
                                gameId: req.body.lobbyId,
                            });
                        }
                    }
                );
            }
        });
    }
});


// removes user from a lobby
router.put('/leave', (req, res, next) => {
    if(req.isAuthenticated()){
        Game.findOne({gameId: req.body.gameId}, (err, result) => {
            if(err) {
                console.log(err.message);
                throw err;
            }
            else {
                // removes the player from the list of players currently in the lobby
                if(req.body.username != result.host){
                    User.update({username: req.body.username}, {$set: {gameId: null}}, (err) => {
                        if(err){
                            console.log(err.message);
                            throw err;
                        }
                    });
                    result.players.splice(result.players.indexOf(req.body.username), 1);
                    Game.update({gameId: req.body.gameId}, {$set: {players: result.players}}, (err) => {
                        if(err) {
                            console.log(err.message);
                            throw err;
                        }
                        else {
                            return res.json({success: true, host: false});
                        }
                    });
                }
                // deletes the game created by the host
                else {
                    result.players.forEach(player => {
                        User.update({username: player}, {$set: {gameId: null}}, (err) => {
                            if(err){
                                console.log(err.message);
                                throw err;
                            }
                        });
                    });

                    Game.deleteOne({gameId: req.body.gameId}, (err) => {
                        if(err) {
                            console.log(err.message);
                            throw err;
                        }
                        else {
                            return res.json({success: true, host: true});
                        }
                    });
                }
            }
        });
    }
});


// get 'num' number of lobbies
router.get('/:num', (req, res) => {
    Game.aggregate([{$sample: {size: Number(req.params.num)}}], (err, response) => {
        if(err) {
            console.log(err.message);
            throw err;
        }
        else if(response) {
            return res.send(response);
        }
    });
});


// retrieves the games question card
router.get("/data/:gameId", (req, res) => {
    Game.findOne({gameId: req.params.gameId}, (err, result) => {
        if(err) {
            console.log(err.message);
            throw err;
        }
        else {
            return res.json({
                question: result.queCard,
                numOfAnswers: result.numOfAnswers,
                players: result.players,
                points: result.points,
                czar: result.czar
            });
        }
    });
});

// retrieves answer cards of a user
router.get("/userCards/:user", (req, res) => {
    User.findOne({username: req.params.user}, (err, result) => {
        if(err) {
            console.log(err.message);
            throw err;
        }
        else {
            return res.json({
                answers: result.currCards,
            });
        }
    });
});


module.exports = router;