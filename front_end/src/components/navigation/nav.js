import React, { Component } from 'react';
import './nav.css'; 
import { TextField } from '@material-ui/core';


class Nav extends Component{
    constructor(){
        super();
        this.state = {
            username: null,
            user_input: ""
        };
    }

    // Goes to routes to login page
    goToLogin = () => {
        console.log("Went to Login page")
    }

    // Logs user out
    logout = () => {
        console.log("Logged user out");
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

                <div className='options'>
                    {/* Checks if user is logged in or not */}
                    {this.state.username != null ? 
                        <div>
                            <p>{this.state.username}</p> 
                            <p onClick={this.logout}>Logout</p> 
                        </div>
                        : 
                        <p onClick={this.goToLogin}>Login</p>}
                </div>
            </div>
        )
    }
}

export default Nav;