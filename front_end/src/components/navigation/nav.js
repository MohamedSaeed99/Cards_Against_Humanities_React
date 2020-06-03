import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './nav.css'; 
import { Button, TextField } from '@material-ui/core';


class Nav extends Component{
    constructor(){
        super();
        this.state = {
            user_input: ""
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
    

    render(){
        return(
            <div className='navigationBar'>
                <div className='searchBar'>
                    {/* Material component textfield for user input */}
                    <TextField 
                        id="outlined-search" 
                        label="Search" 
                        type="search"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.user_input}
                    />
                </div>

                <div>
                    {/* Checks if user is logged in or not */}
                    {this.props.loggedIn ? 
                        <div className="loggedIn">
                            <p className="displayUser">{this.props.username}</p> 
                            <Button><Link to="/" className="btn">Home</Link></Button>
                            <Button><Link to="/" onClick={this.logout} className="btn">Logout</Link></Button>
                        </div>
                        : 
                        <div className="loggedOut">
                            <Button><Link to="/" className="btn">Home</Link></Button>
                            <Button><Link to="/login" className="btn">Login</Link></Button>
                            <Button><Link to="/register" className="btn">Register</Link></Button>
                        </div>}
                </div>
            </div>
        )
    }
}

export default Nav;