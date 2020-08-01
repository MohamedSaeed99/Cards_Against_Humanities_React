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
            gameId: null,
            username: null,
            winner: null,
            points: [],
            isCzar: false,
            players: [],
            queCard: null,
            allAnswers: {},
            selectedAnswers: [],
            submittedAnswers: [],
            numOfAnswers: null,
            userCards: [],
            redirectTo: null,
            hassubmitted: false,
            loaded: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;

        this.getGameId(() => {

            if(this.state.gameId){
                
                this.props.socket.emit("Game Joined", {
                    gameId: this.state.gameId, 
                    username: this.state.username
                });

                console.log(this.props.socket);
                this.retrieveGameData();
                this.retrieveUserCards();

                this.props.socket.emit("Get Initial Answers", (this.state.gameId));
                this.props.socket.emit("Check For Winner", (this.state.gameId));

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
                    if(this._isMounted){
                        this.setState({
                            winner: data.winner,
                            isCzar: false
                        });
                    }
                });
            }
        });
    }


    componentWillUnmount() {
        this._isMounted = false;
    }


    getGameId = (callback) => {
        fetch("/lobby/gameId/", {
            method: "GET",
        }).then(response => {
            response.json().then( body => {
                this.setState({
                    gameId: body.gameId,
                    username: body.username
                }, () => {
                    callback();
                });
            });
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


    highlightWinningPlayer = (winner) => {
        const lobbyStatsClass = document.getElementsByClassName("lobbystats");
        for(let i = 0; i < lobbyStatsClass.length; i++){
            if((lobbyStatsClass[i].childNodes[0].innerText).includes(winner)){
                lobbyStatsClass[i].style.backgroundColor = "lightblue";
            }
        }
    }


    unHighlightPlayers = () => {
        const lobbyStatsClass = document.getElementsByClassName("lobbystats");
        for(let i = 0; i < lobbyStatsClass.length; i++){
            lobbyStatsClass[i].style.backgroundColor = "lightgray";
        }
    }


    getAdditionalCards = () => {
        if(this.state.userCards.length < 12){
            var payload = {
                cards: this.state.userCards,
                username: this.state.username
            }
            fetch("lobby/userCards/", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(payload)
            }).then((response) => {
                response.json().then((body) => {
                    this.setState({
                        userCards: body.cards
                    });
                });
            });
        }
    }


    setupNewRound = () => {
        let payload = {
            gameId: this.state.gameId,
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
                if(body.gameOver){
                    this.props.socket.emit("Player Won", {
                        winner: body.winner,
                        gameId: this.state.gameId
                    });
                }
                console.log("Got players");
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
        fetch("lobby/data/" + this.state.gameId, {
            method: "GET",
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    selectedAnswers: [],
                    submittedAnswers: [],
                    queCard: body.question,
                    numOfAnswers: body.numOfAnswers,
                    players: body.players,
                    points: body.points,
                    isCzar: this.state.winner === null ? body.czar === this.state.username : false,
                    czar: body.czar,
                    hassubmitted: false,
                    loaded: true,
                });
            });
        });
    }


    // gets the question card from the server
    retrieveUserCards = () => {
        fetch("lobby/userCards/" + this.state.username, {
            method: "GET",
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    userCards: body.answers
                });
            });
        });
    }

    
    selectUserAnswer = (event) => {
        if(!this.state.isCzar && !this.state.hassubmitted){
            if(this.state.submittedAnswers.length < this.state.numOfAnswers){
                event.currentTarget.style.backgroundColor = "lightblue"
                const htmlText = event.currentTarget.innerHTML;
                const cardText = htmlText.substring(3, htmlText.indexOf("</p>"));

                this.state.submittedAnswers.push(cardText);
                
                this.setState({
                    submittedAnswers: this.state.submittedAnswers
                });
            }
            else {
                this.unHighlightUserCards();
                this.setState({
                    submittedAnswers: []
                });
            }
        }
    }


    submitUserAnswer = () => {
        this.unHighlightUserCards();
        this.removeUserCardFromList();
        this.props.socket.emit("Submitted Answers", {
            gameId: this.state.gameId,
            username: this.state.username,
            submittedCards: this.state.submittedAnswers,
        });
        this.setState({
            hassubmitted: true,
            submittedAnswers: []
        });
    }


    unHighlightUserCards = () => {
        const userCards = document.getElementsByClassName("userCard");
        for(var i = 0; i < userCards.length; i++){
            userCards[i].style.backgroundColor = "white"
        }
    }


    removeUserCardFromList = () => {
        this.state.submittedAnswers.forEach((card, index) => {
            this.state.userCards.forEach((item, index) => {
                if(item.split('/').join('') === card.split('/').join('')){
                    this.state.userCards.splice(index, 1);
                }
            });
        });
    }


    renderUserCards = () => {
        const userCards = this.state.userCards;
        const cards = userCards.map((card, index) => {
                    return(
                        <div className="userCard" key={index.toString()} onClick={this.selectUserAnswer}>
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
                        <div className="lobbystats" key={index.toString()}>
                            <p  className="players">{name}</p>
                            <div className="point_status">
                                <p className="points">{this.state.points[index]}</p>
                                <p className="czarstatus">{name === this.state.czar ? "Czar" : "Player"}</p>
                            </div>
                        </div>
                    )
            });
        return (users);
    }


    renderAnswers = () => {
        const answers = this.state.allAnswers;
        
        const cards = Object.keys(answers).map((key) => {
            return (
                <div key={key}>
                    {this.state.players.length - 1 === Object.keys(answers).length ?
                        <div className="groupAnswer" key={key}>
                            {answers[key].map((card, ind) => {
                                return (
                                    <div className="answerCard" key={ind.toString()} onClick={this.changeBackgroundColorToSelectColor}>
                                            <p dangerouslySetInnerHTML={{__html: card}} />
                                    </div>
                                );
                            })}
                        </div>
                        :
                        <div className="groupAnswer" key={key}>
                            {answers[key].map((ind) => {
                                return (
                                    <div className="answerCard" key={ind.toString()}>
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            )
        });
        return cards;
    }


    changeBackgroundColorToSelectColor = (event) => {
        if(this.state.isCzar){
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
        if(this.state.selectedAnswers.length !== 0){
            const winningUser = this.findUsername();
            this.props.socket.emit("Selected Answers", {
                user: winningUser,
                winningCards: this.state.selectedAnswers,
                gameId: this.state.gameId
            });
        }
    }


    findUsername = () => {
        for(var key in this.state.allAnswers){
            if(this.state.allAnswers[key].every(answer => this.state.selectedAnswers.includes(answer))){
                return key;
            }
        }
    }


    coverCardWhenCzar = () => {
        if(this.state.isCzar){
            return(<div className="cover">
                <p className="notifier"> YOU ARE CZAR </p>
            </div>);
        }
    }


    displayWinner = () => {
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
                {this.state.loaded ? 
                    <div>
                        {this.displayWinner()}
                        <div className="game">
                            <div className="top">
                                <div className="questionCardArea">
                                    <div className="queCard">
                                        <p dangerouslySetInnerHTML={{__html: this.state.queCard}}/>
                                    </div>
                                    <div className="submitArea">
                                        {this.state.isCzar ? 
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
                            <div className="answerbtncontainer">
                                {this.state.submittedAnswers.length === this.state.numOfAnswers ?
                                    <div>
                                        <Button variant="outlined" className="answerbtn" onClick={this.submitUserAnswer}>Submit Answers</Button> 
                                    </div>
                                    :
                                    <Button variant="outlined" className="answerbtn" disabled>Submit Answers</Button> 
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div></div>
                }            
            </div>
        )
    }
}

export default Game;