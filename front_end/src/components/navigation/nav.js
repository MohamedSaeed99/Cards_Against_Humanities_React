import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './nav.css'; 
import { Button, TextField } from '@material-ui/core';

class Nav extends Component{
    constructor(props){
        super(props);
        this.state = {
            user_input: "",
        };
    }

    // Logs user out
    logout = () => {
        // make post to let server know u logged out
        this.props.onLogoutChange(false, null);
        fetch("/logout/", {
            method: "GET"
        }).then((response) => {
            console.log(response)
        });
    }


    // Stores the value of the user input
    onChange = (event) => {
        this.setState({ user_input: event.currentTarget.value });
    }

    // sets the state of the application when user leaves
    leaveGame = () => {
        var payload = ({
            username: this.props.username,
            gameId: this.props.gameId
        });

        fetch("/lobby/leave", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }).then( (response) => {
            response.json().then((body) => {
                if(body.success) {
                    if(body.host) {
                        this.props.socket.emit("Host Leaving", {gameId: this.props.gameId});
                    }
                    else {
                        this.props.socket.emit("User Leaving", {
                            gameId: this.props.gameId,
                            updateCzar: body.czarLeft
                        });
                    }
                    this.props.onLeaveGame(false, null);
                }
            });
        });
    }

    // Lists the options available for user at the navbar
    userOptions = () => {
        if(this.props.joinedGame){
            return <div className="loggedIn">
                    <p className="displayUser">{this.props.username}</p> 
                    <Button><Link to="/" onClick={this.leaveGame} className="btn">Leave</Link></Button>
                </div>
        }
        else {
            if(this.props.loggedIn){
                return (<div className="loggedIn">
                            <p className="displayUser">{this.props.username}</p> 
                            <Button><Link to="/" className="btn">Home</Link></Button>
                            <Button><Link to="/" onClick={this.logout} className="btn">Logout</Link></Button>
                        </div>);
            }
            else {
                return (<div className="loggedOut">
                            <Button><Link to="/" className="btn">Home</Link></Button>
                            <Button><Link to="/login" className="btn">Login</Link></Button>
                            <Button><Link to="/register" className="btn">Register</Link></Button>
                        </div>);
            }
        }
    }
    

    render(){
        return(
            <div className='navigationBar'>
                <div className='searchBar'>
                    {/* Material component textfield for user input */}
                    {this.props.joinedGame ?
                        <TextField 
                            disabled
                            id="outlined-search" 
                            label="Search" 
                            type="search"
                            variant="outlined"
                            onChange={this.onChange}
                            value={this.state.user_input}
                        /> :
                        <TextField 
                            id="outlined-search" 
                            label="Search" 
                            type="search"
                            variant="outlined"
                            onChange={this.onChange}
                            value={this.state.user_input}
                        /> 
                    }
                </div>
                <div>
                    {/* Checks if user is logged in or not */}
                    {this.userOptions()}
                </div>
            </div>
        )
    }
}

export default Nav;