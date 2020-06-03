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