import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import './game.css'

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            points: [],
            players: [],
            queCard: null,
            answers: {},
            possibleAnswers: null,
            userCards: [],
            redirectTo: null
        }
    }

    componentDidMount() {
        // sets up the game
        this.retrieveGameData();
        this.retrieveUserCards();

        this.props.socket.on("User Joined", (username) => {
            this.state.players.push(username);
            this.state.points.push(0);
            this.setState({
                players: this.state.players,
                points: this.state.points
            });
        });

        // removes players from the lobby
        this.props.socket.on("Host Left", () => {
            console.log("HOST LEFT");
            this.props.onLeaveGame(false, null);
            this.setState({
                redirectTo: "/"
            });
        });

        // notifies other players within the lobby that the user left
        this.props.socket.on("User Left", (username) => {
            const index = this.state.players.indexOf(username);
            this.state.players.splice(index, 1);
            this.state.points.splice(index, 1);

            this.setState({
                players: this.state.players,
                points: this.state.points
            });

        });
    }

    // gets the question card from the server
    retrieveGameData = () => {
        fetch("lobby/data/" + this.props.gameId, {
            method: "GET",
            header: {
                "Content-type": "application/json",
                Accept: "application/json"
            }
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    queCard: body.question,
                    possibleAnswers: body.numOfAnswers,
                    players: body.players,
                    points: body.points
                });
            });
        });
    }


    // gets the question card from the server
    retrieveUserCards = () => {
        fetch("lobby/userCards/" + this.props.username, {
            method: "GET",
            header: {
                "Content-type": "application/json",
                Accept: "application/json"
            }
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    userCards: body.answers
                });
            });
        });
    }


    renderUserCards = () => {
        const userCards = this.state.userCards;
        const cards = userCards.map((card, index) => {
                    return(
                        <div className="userCard" key={index.toString()}>
                            <p dangerouslySetInnerHTML={{__html: card}}/>
                        </div>
                    )
            });
        return (cards);
    }

    renderUsernames = () => {
        const players = this.state.players;
        const users = players.map((name, index) => {
                    return(
                        <div key={index.toString()}>
                            <p  className="players">{name}: {this.state.points[index]}</p>
                        </div>
                    )
            });
        return (users);
    }

    
    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div className="game">
                <div className="top">
                    <div className="questionCardArea">
                        <div className="queCard">
                            <p dangerouslySetInnerHTML={{__html: this.state.queCard}}/>
                        </div>
                    </div>
                    <div className="answerCards">
                        <p>Location of answer cards</p>
                    </div>
                </div>
                <div className="bottom">
                    <div className="gameStats">
                        {this.renderUsernames()}
                    </div>
                    <div className="playerCards">
                        {this.renderUserCards()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Game;