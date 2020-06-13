import React, {Component} from 'react';
import './game.css'

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            points: {},
            players: {},
            queCard: null,
            answers: {},
            possibleAnswers: {}
        }
    }

    render(){
        return(
            <div className="game">
                <div className="top">
                    <div className="questionCard">
                        <p>Location of question card</p>
                    </div>
                    <div className="answerCards">
                        <p>Location of answer cards</p>
                    </div>
                </div>
                <div className="bottom">
                    <div className="gameStats">
                        <p>This is going to be the side portion</p>
                    </div>
                    <div className="playerCards">
                        <p>This is going to be the side portion</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Game;