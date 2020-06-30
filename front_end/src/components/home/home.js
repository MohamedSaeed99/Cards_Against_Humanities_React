import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import "./home.css";


class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            redirectTo: null,
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

    loginUser = () => {
        this.setState({redirectTo: "/login"});
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
        var payload = {username: this.props.username};
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
        if(!this.props.loggedIn) {
            this.loginUser();
        }
        else{
            this.addToGame(lobby);
        }
    }

    addToGame = (lobby) => {
        var payload = {
            username: this.props.username,
            lobbyId: lobby.gameId
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
                }
            });
        });

        this.props.socket.emit("Game Joined", {gameId: lobby.gameId, username: this.props.username});
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
                    {this.state.lobbies.map((lobby) => (
                        <div className="lobbyCard" key={lobby.host} onClick={() => this.enterGameWhenLoggedIn(lobby)}> 
                            <h3 className="lobbyTitle">{lobby.host}</h3>
                        </div>
                    ))}
                </div>
                <div className="footer">
                    <Button variant="contained" color="primary" className="createbtn" onClick={this.createGameWhenLoggedIn}>Create Game</Button>
                </div>
            </div>
        );
    }
}

export default Home;