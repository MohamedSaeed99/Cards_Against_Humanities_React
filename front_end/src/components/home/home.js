import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import "./home.css";


class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            redirectTo: null,
            maxPoints: 8,
            password: "",
            lobbyPassword: "",
            maxPlayers: 4,
            hover: false,
            doPromptForPass: false,
            isPassCorr: true,
            selectedLobby: {},
            lobbies: []
        };
    }


    componentDidMount() {
        this.retrieveLobbies();
    }


    // gets a maxiumum of 10 lobbies
    retrieveLobbies = () => {
        fetch('/lobby/10', {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            }
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    lobbies: body
                });
            });
        });
    }


    createGameWhenLoggedIn = () => {
        if(!this.props.loggedIn) {
            this.loginUser();
        }
        else {
            this.createGame();
        }
    }


    createGame = () => {
        var payload = {
            username: this.props.username,
            maxPoints: this.state.maxPoints,
            password: this.state.password,
            maxPlayers: this.state.maxPlayers
        };
        fetch('/lobby/', {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                Accept: "application/json"
            },

            body: JSON.stringify(payload)
        }).then((response)=>{
            response.json().then((body) => {

                this.props.onJoinGame(true, body.gameId);
                this.props.socket.emit("Created Game", {gameId: body.gameId, username: this.props.username});
                this.setState({
                    redirectTo: "/game"
                });
                
            });
        });
    }


    enterGameWhenLoggedIn = (lobby) => {

        this.setState({
            selectedLobby: lobby
        }, () => {
            if(!this.props.loggedIn) {
                this.loginUser();
            }
            else if(lobby.password.length !== 0){
                this.setState({
                    doPromptForPass: true
                });
            }
            else{
                
                this.setState({
                    doPromptForPass: false
                });

                this.addToGame();
            }
        });
    }


    loginUser = () => {
        this.setState({redirectTo: "/login"});
    }


    addToGame = () => {
        var payload = {
            username: this.props.username,
            lobbyId: this.state.selectedLobby.gameId
        }
        fetch("/lobby/add", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }).then( (response) => {
            response.json().then((body) => {
                if(body.success) {
                    this.props.onJoinGame(true, body.gameId);
                    this.setState({
                        redirectTo: "/game"
                    });
                }else {
                    alert(body.message);
                }
            });
        });


        this.props.socket.emit("Game Joined", {
            gameId: this.state.selectedLobby.gameId, 
            username: this.props.username
        });
    }


    showGameSpecifications = () => {
        this.setState({
            hover: true
        });
    }


    removeGameSpecifications = () => {
        this.setState({
            hover: false
        });
    }


    onAddPassword = (event) => {
        this.setState({
            password: event.currentTarget.value
        });
    }

    
    onRoundChange = (event) => {
        if(isNaN(event.currentTarget.value)){
            console.log("This is not a number");
        }
        else{
            this.setState({
                maxPoints: event.currentTarget.value
            });
        }
    }


    onPlayerChange = (event) => {
        if(isNaN(event.currentTarget.value)){
            console.log("This is not a number");
        }
        else{
            this.setState({
                maxPlayers: event.currentTarget.value
            });
        }
    }


    renderLobbies = () => {
        const lobbies = this.state.lobbies.map((lobby) => (
            <div className="lobbyCard" key={lobby.host} onClick={() => this.enterGameWhenLoggedIn(lobby)}> 
                <h3 className="lobbyTitle">{lobby.host}</h3>
            </div>
        ))

        return lobbies;
    }


    doRenderPasswordPrompt = () => {
        return(
            <div className="passwordPrompt">
                <div className="passwordPromptArea">

                    {this.state.isPassCorr ? 
                    <div></div>
                    :
                    <div> 
                        <p>Password is incorrect.</p>
                    </div>
                    }

                    <TextField
                        className="lobbyPassField"
                        label="Password" 
                        type="input"
                        variant="outlined"
                        onChange={this.onLobbyPassChange}
                        value={this.state.lobbyPassword}
                    />
                    <div className="modalbtn">
                        <Button variant="contained" color="primary" className="closebtn" onClick={this.closeModal}>Close</Button>
                        <Button variant="contained" color="primary" className="passwordbtn" onClick={this.comparePasswords}>Submit</Button>
                    </div>
                </div>
            </div>
        );
    }


    closeModal = () => {
        this.setState({
            doPromptForPass: false
        });
    }


    comparePasswords = () => {
        if(this.state.lobbyPassword === this.state.selectedLobby.password){
            this.addToGame();
        }
        else {
            this.setState({
                isPassCorr: false
            });
        }
    }


    onLobbyPassChange = (event) => {
        this.setState({
            lobbyPassword: event.currentTarget.value
        });
    }


    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div>
                <div className="siteTitle">
                    <h1>Cards Against Humanities</h1>
                </div>
                <div className="lobbies">
                    {this.renderLobbies()}
                    {this.state.doPromptForPass ? this.doRenderPasswordPrompt():<div></div>}
                </div>
                <div className="footer">
                    <div className="gameSpecs" onMouseEnter={this.showGameSpecifications} onMouseLeave={this.removeGameSpecifications}>
                        {this.state.hover ? 
                        <div className="innerGameSpecs">
                            <div className="icon">
                                <svg width="20px" height="20px" viewBox="0 0 16 16" className="bi bi-arrow-down-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path fillRule="evenodd" d="M4.646 7.646a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"/>
                                    <path fillRule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </div>
                            <div className="options">
                                <TextField
                                    id="outlined-search" 
                                    className="roundField"
                                    label="Max Points" 
                                    type="input"
                                    variant="outlined"
                                    onChange={this.onRoundChange}
                                    value={this.state.maxPoints}
                                /> 
                                <TextField
                                    id="outlined-search" 
                                    className="playerField"
                                    label="Max Players" 
                                    type="input"
                                    variant="outlined"
                                    onChange={this.onPlayerChange}
                                    value={this.state.maxPlayers}
                                /> 
                                <TextField
                                    id="outlined-search" 
                                    className="passwordField"
                                    label="Password" 
                                    type="input"
                                    variant="outlined"
                                    onChange={this.onAddPassword}
                                    value={this.state.password}
                                /> 
                            </div>
                        </div>
                        :
                        <div className="icon">
                            <svg width="20px" height="20px" viewBox="0 0 16 16" className="bi bi-arrow-up-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path fillRule="evenodd" d="M4.646 8.354a.5.5 0 0 0 .708 0L8 5.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"/>
                                <path fillRule="evenodd" d="M8 11.5a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-1 0v5a.5.5 0 0 0 .5.5z"/>
                            </svg>
                        </div>
                        }
                    </div>
                    <Button variant="contained" color="primary" className="createbtn" onClick={this.createGameWhenLoggedIn}>Create Game</Button>
                </div>
            </div>
        );
    }
}

export default Home;