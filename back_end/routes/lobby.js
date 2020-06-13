const express = require('express');
const router = express.Router();
const Game = require('../db/models/games');
const User = require('../db/models/user');
const crypto = require("crypto");



router.post('/', (req, res, next) => {
    if(req.isAuthenticated()){
        const game = new Game({
            host: req.body.username,
            gameId: crypto.randomBytes(20).toString('hex'),
            players: [req.body.username]
        });

        game.save( (error) => {
            if(error) {
                return res.json({success: false, message: error.message});
            }
            else{
                // updates the host with the gameid they created
                User.update({username: req.body.username}, {$set: {gameId: game.gameId}}, (err, result) => {
                    if(err){
                        console.log(err.message);
                    }
                    else {
                        return res.json({success:true, gameId: game.gameId});
                    }
                });
            }
        });
    }
});


router.put('/add', (req, res, next) => {
    if(req.isAuthenticated()){

        // updates the user of the gameid they joined
        User.update({username: req.body.username}, {$set: {gameId: req.body.lobbyId}}, (err, result) => {
            if(err){
                console.log(err.message);
                return res.json({success: false, message: err.message});
            }
            else{
                // updates the game of the new user that joined
                Game.update (
                    { gameId: req.body.lobbyId }, 
                    { $addToSet: { players: req.body.username }}, (err, result) => {
                        if(err){
                            console.log(err.message);
                            return res.json({success: false, message: err.message});
                        }
                        else{
                            return res.json({success: true, gameId: req.body.lobbyId});
                        }
                    }
                );
            }
        });
    }
});

router.put('/leave', (req, res, next) => {
    if(req.isAuthenticated()){
        console.log(req.body);
        Game.findOne({gameId: req.body.gameId}, (err, result) => {
            if(err) {
                console.log(err);
            }
            else {
                // removes the player from the list of players currently in the lobby
                if(req.body.username != result.host)
                    console.log(result.players.splice(result.players.indexOf(req.body.username), 1));
                // deletes the game created by the host
                else {
                    console.log("Here");
                    result.players.forEach(player => {
                        User.update({username: player}, {$unset: {gameId: null}}, (err, result) => {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log(result);
                            }
                        });
                    });
                    return res.json({success: true});
                    // Game.deleteOne({gameId: req.body.lobbyId}, (err, result) => {
                    //     if(err){
                    //         return res.json({success: false, message: err.message});
                    //     }
                    //     else {

                    //     }
                    // });
                }
            }
        });
    }
});


router.get('/:num', (req, res) => {
    Game.aggregate([{$sample: {size: Number(req.params.num)}}], (err, response) => {
        if(err) {
            console.log("Error: ", err.message);
        }
        else if(response) {
            res.send(response);
        }
    });
});

module.exports = router;
