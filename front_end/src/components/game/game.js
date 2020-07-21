import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import { Button } from '@material-ui/core';
import Confetti from 'react-confetti'
import './game.css'

class Game extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            winner: null,
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
        this._isMounted = true;

        // sets up the game
        this.retrieveGameData();
        this.retrieveUserCards();

        this.props.socket.emit("Get Initial Answers", (this.props.gameId));

        this.props.socket.on("User Joined", (username) => {
            if(!this.state.players.includes(username)){
                this.state.players.push(username);
                this.state.points.push(0);

                if(this._isMounted){
                    this.setState({
                        players: this.state.players,
                        points: this.state.points
                    });
                }
            }
        });

        // removes players from the lobby
        this.props.socket.on("Host Left", () => {
            this.props.onLeaveGame(false, null);
            if(this._isMounted){
                this.setState({
                    redirectTo: "/"
                });
            }
        });

        // notifies other players within the lobby that the user left
        this.props.socket.on("User Left", (data) => {
            if(data.updateCzar) {
                if(this._isMounted){
                    this.getAdditionalCards();
                    this.retrieveGameData();
                    this.setState({
                        allAnswers: {}
                    });
                }
            }
            const index = this.state.players.indexOf(data.username);
            this.state.players.splice(index, 1);
            this.state.points.splice(index, 1);
            if(this._isMounted){
                this.setState({
                    players: this.state.players,
                    points: this.state.points
                });
            }
        });

        this.props.socket.on("Answer Cards", (data) => {
            const answers = this.state.allAnswers;
            answers[data.user] = data.cards
            if(this._isMounted){
                this.setState({
                    allAnswers: answers
                });
            }
        });

        this.props.socket.on("Update Initial Answers", (data) => {
            const answers = this.state.allAnswers;
            for(let key in data){
                answers[key] = data[key];
            }

            if(this._isMounted){
                this.setState({
                    allAnswers: answers
                });
            }
        });

        this.props.socket.on("Set Up Next Round", ()=> {
            if(this._isMounted){
                this.setupNewRound();
            }
        });

        this.props.socket.on("Winning Cards", (data) => {
            // highlight cards for a second and then erase
            if(this._isMounted){

                this.highlightWinningCards(data.winningCards);
                this.highlightWinningPlayer(data.winningPlayer);
                this.getAdditionalCards();
                
                setTimeout(function(){
                    this.retrieveGameData();
                    this.setState({
                        allAnswers: {}
                    });
                    this.unHighlightPlayers();
                }.bind(this), 1000);
            }
        });

        this.props.socket.on("Winner Found", (data) => {
            console.log("Winner was alredy found");
            if(this._isMounted){
                this.setState({
                    winner: data.winner,
                }, ()=>{
                    console.log("winner updated", this.state.winner);
                });
            }
        });
    }


    componentWillUnmount() {
        this._isMounted = false;
    }


    highlightWinningCards = (cards) => {
        const answerCards = document.getElementsByClassName("answerCard");
        for(let i = 0; i < answerCards.length; i++){
            if(cards.includes(answerCards[i].innerHTML.substring(3, answerCards[i].innerHTML.indexOf("</p>")))){
                answerCards[i].style.backgroundColor = "lightblue";
            }
        }
    }


    highlightWinningPlayer = (winner) => {
        const players = document.getElementsByClassName("players");
        for(let i = 0; i < players.length; i++){
            if((players[i].innerText).includes(winner)){
                players[i].style.backgroundColor = "lightblue";
            }
        }
    }


    unHighlightPlayers = () => {
        const players = document.getElementsByClassName("players");
        for(let i = 0; i < players.length; i++){
            players[i].style.backgroundColor = "lightgray";
        }
    }


    getAdditionalCards = () => {
        if(this.state.userCards.length <= 12){
            fetch("lobby/cards/" + this.state.userCards.length.toString(), {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json"
                }
            }).then((response) => {
                response.json().then((body) => {
                    let newCards = this.state.userCards.concat(body.cards);
                    this.setState({
                        userCards: newCards
                    });
                });
            });
        }
    }


    setupNewRound = () => {
        let payload = {
            gameId: this.props.gameId,
            winner: this.findUsername(),
        }

        fetch("lobby/newround/", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }).then((response) => {
            response.json().then((body) => {
                console.log("Here1")
                if(body.gameOver){
                    console.log("Here2")
                    this.props.socket.emit("Player Won", {
                        winner: body.winner,
                        gameId: this.props.gameId
                    });
                }
            });
        });
    }

    /*
        Game Data Includes:
            Question Card
            Number of Answers per queCard
            Players
            Points
    */
    retrieveGameData = () => {
        console.log(this.props.gameId);
        fetch("lobby/data/" + this.props.gameId, {
            method: "GET",
            header: {
                "Content-type": "application/json",
                Accept: "application/json"
            }
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    selectedAnswers: [],
                    submittedAnswers: [],
                    queCard: body.question,
                    numOfAnswers: body.numOfAnswers,
                    players: body.players,
                    points: body.points,
                    czar: this.state.winner === null ? body.czar === this.props.username : false
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
        if(this.state.numOfAnswers > 0 && !this.state.czar){
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
        const winningUser = this.findUsername();
        this.props.socket.emit("Selected Answers", {
            user: winningUser,
            winningCards: this.state.selectedAnswers,
            gameId: this.props.gameId
        });
    }


    findUsername = () => {
        for(var key in this.state.allAnswers){
            if(this.state.allAnswers[key].every(answer => this.state.selectedAnswers.includes(answer))){
                return key;
            }
        }
    }


    coverCardWhenCzar = () => {
        if(this.state.czar){
            return(<div className="cover">
                <p className="notifier"> YOU ARE CZAR </p>
            </div>);
        }
    }


    displayWinner = () => {
        console.log("Renderuing");
        const { innerWidth: width, innerHeight: height } = window;
        if(this.state.winner){
            return(
            <div>
                <Confetti
                    width={width}
                    height={height}
                />
                <div className="displayWinner">
                    <p className="winner">{this.state.winner} Won The Game</p>
                </div>
                </div>)
        }
    }

    
    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div>
                {this.displayWinner()}
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
                            {this.coverCardWhenCzar()}
                            {this.renderUserCards()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Game;