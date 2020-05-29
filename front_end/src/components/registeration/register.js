import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import './register.css';

class Register extends Component{

    constructor(){
        super();
        this.state ={
            user_username: null,
            user_password: null
        }
    }


    render(){
        return(
            <div className="registeration">
                <div className="form">
                    <h1>Register</h1>
                    <TextField className="username" label="Username"/>
                    <TextField className="password" type="password" label="Password"/>
                </div>
            </div>
        );
    }
}

export default Register;