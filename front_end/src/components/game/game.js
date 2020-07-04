import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import { Button } from '@material-ui/core';
import './game.css'

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            points: [],
            czar: false,
            players: [],
            queCard: null,
            allAnswers: {},
            selectedAnswers: [],
            submittedAnswers: [],
            numOfAnswers: null,
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

        this.props.socket.on("Answer Cards", (data) => {
            const answers = this.state.allAnswers;
            answers[data.user] = data.cards
            this.setState({
                allAnswers: answers
            });
        });

        this.props.socket.on("Winning Cards", (data) => {
            // highlight cards for a second and then erase
            this.highlightWinningCards(data);
            setTimeout(function(){ 
                this.setState({
                    allAnswers: {},
                    selectedAnswers: [],
                    submittedAnswers: []
                });
            }.bind(this), 2000);
        });
    }

    highlightWinningCards = (cards) => {
        const answerCards = document.getElementsByClassName("answerCard");
        for(let i = 0; i < answerCards.length; i++){
            if(cards.includes(answerCards[i].innerHTML.substring(3, answerCards[i].innerHTML.indexOf("</p>")))){
                answerCards[i].style.backgroundColor = "lightblue";
            }
        }
    }

    /*
        Game Data Includes:
            Question Card
            Number of Answers per queCard
            Players
            Points
    */
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
                    numOfAnswers: body.numOfAnswers,
                    players: body.players,
                    points: body.points,
                    czar: body.czar === this.props.username
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

    
    submitUserAnswer = (event) => {
        if(this.state.numOfAnswers > 0 /*&& !this.state.czar*/){
            const htmlText = event.currentTarget.innerHTML;
            const cardText = htmlText.substring(3, htmlText.indexOf("</p>"));

            this.state.submittedAnswers.push(cardText);
            
            this.removeUserCardFromList(cardText);
            const numOfAnswers = this.state.numOfAnswers - 1;
            this.setState({
                userCards: this.state.userCards,
                numOfAnswers: numOfAnswers,
                submittedAnswers: this.state.submittedAnswers
            });
            if(numOfAnswers === 0) {
                this.props.socket.emit("Submitted Answers", {
                    gameId: this.props.gameId,
                    username: this.props.username,
                    submittedCards: this.state.submittedAnswers
                });
            }
        }
    }


    removeUserCardFromList = (cardText) => {
        this.state.userCards.forEach((item, index) => {
            if(item.split('/').join('') === cardText.split('/').join('')){
                this.state.userCards.splice(index, 1);
            }
        });
    }


    renderUserCards = () => {
        const userCards = this.state.userCards;
        const cards = userCards.map((card, index) => {
                    return(
                        <div className="userCard" key={index.toString()} onClick={this.submitUserAnswer}>
                            <p dangerouslySetInnerHTML={{__html: card}}/>
                        </div>
                    );
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


    renderAnswers = () => {
        const answers = this.state.allAnswers;

        const cards = Object.keys(answers).map((key) => {
            return (
                <div className="groupAnswer" key={key}>
                    {answers[key].map((card, ind) => {
                        return (<div className="answerCard" key={ind.toString()} onClick={this.changeBackgroundColorToSelectColor}>
                                <p dangerouslySetInnerHTML={{__html: card}} />
                            </div>
                        );
                    })}
                </div>
            )
        });
        return cards;
    }


    changeBackgroundColorToSelectColor = (event) => {
        if(this.state.czar){
            const answerCards = document.getElementsByClassName("answerCard");
            for(let i = 0; i < answerCards.length; i++){
                answerCards[i].style.backgroundColor = "white";
            }

            // gets the higher level of the selected div to highlight all the cards belonging to one player
            var parentDiv = event.target.parentElement;
            while(parentDiv.className !== "groupAnswer"){
                parentDiv = parentDiv.parentElement
            }

            const children = parentDiv.childNodes;

            let answerInText = [];
            for(let i = 0; i < children.length; i++){
                children[i].style.backgroundColor = "lightblue";
                answerInText.push(children[i].innerHTML.substring(3, children[i].innerHTML.indexOf("</p>")));
            }

            this.setState({
                selectedAnswers: answerInText
            });
        }
    }


    chooseAnswer = () => {
        // Update the database
        // get the username of the winner
        console.log("HERER");
        const winningUser = this.findUsername();
        console.log("HERER");
        this.props.socket.emit("Selected Answers", {
            user: winningUser,
            winningCards: this.state.selectedAnswers,
            gameId: this.props.gameId
        });
    }


    findUsername = () => {
        for(var key in this.state.allAnswers){
            if(this.state.allAnswers[key].every(v => this.state.selectedAnswers.includes(v))){
                return key
            }
        }
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
                        <div className="submitArea">
                            {this.state.czar ? 
                                <Button variant="outlined" className="submitBtn" onClick={this.chooseAnswer}>Submit</Button> 
                                :
                                <Button variant="outlined" className="submitBtn" disabled>Submit</Button> }

                        </div>
                    </div>
                    <div className="answerCards">
                        {this.renderAnswers()}
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