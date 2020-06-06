const express = require('express');
const router = express.Router();
const Game = require('../db/models/games');
const crypto = require("crypto");



router.post('/', (req, res, next) => {
    if(req.isAuthenticated()){
        const game = new Game({
            host: req.body.username,
            gameId: crypto.randomBytes(20).toString('hex')
        });

        game.save( (error) => {
            if(error) {
                return res.json({success: false, message: error.message});
            }
            else{
                console.log("Game Created");
                return res.json({success:true})
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
