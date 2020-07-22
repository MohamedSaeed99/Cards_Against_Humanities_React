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
    var amountNeeded = 12 - current;
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
            points: [0],
            password: req.body.password,
            maxPoints: Number(req.body.maxPoints),
            maxPlayers: req.body.maxPlayers
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
        Game.findOne({gameId: req.body.lobbyId},  (err, result) => {
            if(err) {
                throw err;
            }
            else{
                if(result) {
                    // Prevents the addition of duplicate username to player list and point list
                    if(result.players.length + 1 <= result.maxPlayers){
                        if(result.players.includes(req.body.username)){
                            return res.json({
                                success: true,
                                gameId: req.body.lobbyId
                            });
                        }
                        else{
                            User.update({username: req.body.username}, {$set: {gameId: req.body.lobbyId, currCards: ansCards}}, (err) => {
                                if(err){
                                    console.log(err.message);
                                    throw err;
                                }
                            });
                            Game.update({gameId: req.body.lobbyId}, 
                                {$addToSet: {players: req.body.username},
                                $push: {points: 0}}, (err) => {
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
                            });
                        }
                    }
                    else{
                        return res.json({
                            success: false, 
                            message: "Lobby Full."
                        });
                    }
                }
                else{
                    return res.json({
                        success: false,
                        message: "Lobby Doesn't Exist Anymore."
                    });
                }
            }
        });
    }
});


// removes user from a lobby
router.put('/leave', (req, res) => {
    if(req.isAuthenticated()){
        var isCzar = false;

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

                    let czar = result.czar;

                     // checks if person that left was czar
                     if(req.body.username === result.czar){
                        czar = updateCzar(req.body.username, result.players);
                        isCzar = true;
                    }

                    let indexOfPlayer = result.players.indexOf(req.body.username);
                    result.players.splice(indexOfPlayer, 1);
                    result.points.splice(indexOfPlayer, 1);
                    
                    Game.update({gameId: req.body.gameId}, {$set: {players: result.players, czar: czar, points: result.points}}, (err) => {
                        if(err) {
                            console.log(err.message);
                            throw err;
                        }
                        else {
                            return res.json({
                                success: true, 
                                host: false,
                                czarLeft: isCzar
                            });
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
            var extractData = [];
            console.log(response);
            for(let i = 0; i < response.length; i++){
                let data = {
                    numOfPlayers: response[i].players.length,
                    gameId: response[i].gameId,
                    password: response[i].password,
                    maxPlayers: response[i].maxPlayers,
                    host: response[i].host
                };
                extractData.push(data);
            }
            return res.send(extractData);
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


router.get("/cards/:amount", (req, res) => {
    return res.json({
        cards: randAnsCards(Number(req.params.amount))
    });
});


// After every round checks if there is a winner
router.put("/newround", (req, res) => {
    Game.findOne({gameId: req.body.gameId}, (err, result)=> {
        if(err) {
            throw err;
        }

        let points = result.points;
        let indexOfWinner= result.players.indexOf(req.body.winner);
        points[indexOfWinner] = points[indexOfWinner] + 1; 
        
        if(points[indexOfWinner] === result.maxPoints){
            console.log("Winner found")
            Game.update({gameId: req.body.gameId}, 
                {$set: { points: points }},(err) => {
                if (err) {
                    throw err;
                }
                return res.json({
                    gameOver: true,
                    winner: req.body.winner
                });
            });
        }
        else {
            let randomQue = randQueCard();
            let newCzar = updateCzar(result.czar, result.players);

            Game.update({gameId: req.body.gameId}, 
                {$set: { queCard: randomQue[0], numOfAnswers: randomQue[1], czar: newCzar, points: points }},
                (err) => {
                    if(err){
                        throw err;
                    }
                    return res.json({gameOver: false, success: true});
            });
        }
    });
});

let updateCzar = (username, players) => {
    let indexOfPrevCzar = players.indexOf(username);
    let indexOfNewCzar = indexOfPrevCzar + 1;

    if(indexOfNewCzar >= players.length){
        return players[0];
    }
    else{
        return players[indexOfNewCzar];
    }
}


module.exports = router;