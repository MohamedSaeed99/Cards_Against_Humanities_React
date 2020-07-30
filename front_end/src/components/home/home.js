import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import Search from "./searchBar/search"
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
            lobbies: [],
            user_input: null
        };
    }


    componentDidMount() {
        this.retrieveRandomLobbies();
    }


    retrieveRandomLobbies = () => {
        fetch('/lobby/random/10', {
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
        if(!this.props.isLoggedIn) {
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
            if(!this.props.isLoggedIn) {
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
        else if(Number(event.currentTarget.value) < 4){
            console.log("Has to be greater than 3");
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
        else if(Number(event.currentTarget.value) <= 1){
            console.log("Has to be greater than 1");
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
                {lobby.password.length !== 0 ?
                <div className="lockIcon">
                    <svg viewBox="0 0 16 16" className="bi bi-shield-lock" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.443 1.991a60.17 60.17 0 0 0-2.725.802.454.454 0 0 0-.315.366C1.87 7.056 3.1 9.9 4.567 11.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0 0 8 14.5c.007-.001.038-.005.097-.023.072-.022.166-.058.282-.111.23-.106.525-.272.857-.5a10.197 10.197 0 0 0 2.197-2.093C12.9 9.9 14.13 7.056 13.597 3.159a.454.454 0 0 0-.315-.366c-.626-.2-1.682-.526-2.725-.802C9.491 1.71 8.51 1.5 8 1.5c-.51 0-1.49.21-2.557.491zm-.256-.966C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815z"/>
                        <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        <path d="M7.411 8.034a.5.5 0 0 1 .493-.417h.156a.5.5 0 0 1 .492.414l.347 2a.5.5 0 0 1-.493.585h-.835a.5.5 0 0 1-.493-.582l.333-2z"/>
                    </svg>
                </div>
                :
                <div></div>}
                <h3 className="lobbyTitle">{lobby.host}</h3>
                <div className="playercount">
                    <p>{lobby.numOfPlayers}/{lobby.maxPlayers}</p>
                </div>
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


    onUserInputChange = (user) => {
        this.setState({
            user_input: user
        }, () => {
            this.retrieveLobbiesBasedUser();
        });
    }


    retrieveLobbiesBasedUser = () => {
        fetch('/lobby/user/' + this.state.user_input, {
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


    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div className="homepage">
                {this.state.doPromptForPass ? this.doRenderPasswordPrompt():<div></div>}
                <div className="searchBar">
                    <Search 
                        retrieveUserInput={this.onUserInputChange}
                    >
                    </Search>
                </div>
                <div className="lobbies">
                    {this.renderLobbies()}
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