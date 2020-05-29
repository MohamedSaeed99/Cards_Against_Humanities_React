import React, { Component } from 'react';
import { Link } from "react-router-dom";
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

    // Goes to routes to login page
    // goToReg = () => {
    //     <Link to="/login" className="btn">
    //     </Link>
    // }

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

                <div>
                    {/* Checks if user is logged in or not */}
                    {this.state.username != null ? 
                        <div className="loggedIn">
                            <p>{this.state.username}</p> 
                            <Link to="/logout" className="btn">Logout</Link>
                        </div>
                        : 
                        <div className="loggedOut">
                            <Link to="/login" className="btn">Login</Link>
                            <Link to="/register" className="btn">Register</Link>
                        </div>}
                </div>
            </div>
        )
    }
}

export default Nav;