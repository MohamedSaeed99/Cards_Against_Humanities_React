import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import "./home.css";

class Home extends Component {
    constructor(){
        super();
        this.state={
            redirectTo: null,
            lobbies: []
        };

        this.retrieveLobbies();
    }

    createLobby = () => {
        if(!this.props.loggedIn) {
            this.setState({redirectTo: "/login"});
        }
        else {
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
                    console.log(body);
                });
            });
        }
    }


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


    onClick = (lobby) => {
        console.log(lobby);
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
                        <div className="lobbyCard" key={lobby.host} onClick={() => this.onClick(lobby)}> 
                            <h3 className="lobbyTitle">{lobby.host}</h3>
                        </div>
                    ))}
                </div>
                <div className="footer">
                    <Button variant="contained" color="primary" className="createbtn" onClick={this.createLobby}>Create Game</Button>
                </div>
            </div>
        );
    }
}

export default Home;