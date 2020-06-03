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

    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div>
                <div className="lobbyList">
                    <h1>Hello World</h1>
                </div>
                <div className="footer">
                    <Button variant="contained" color="primary" className="createbtn" onClick={this.createLobby}>Create Game</Button>
                </div>
            </div>
        );
    }
}

export default Home;