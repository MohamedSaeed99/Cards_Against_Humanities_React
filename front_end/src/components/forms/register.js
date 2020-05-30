import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import './form.css';

class Register extends Component{

    constructor(){
        super();
        this.state ={
            user_username: null,
            user_password: null
        }
    }

    // Makes post request to 
    registerUser = () => {
        console.log(this.state.user_username)
        console.log(this.state.user_password)
    }

    // Stores the state of current user input
    onChange = (event) => {
        if(event.currentTarget.type === "password"){
            this.setState({user_password: event.currentTarget.value});
        }
        else{
            this.setState({user_username: event.currentTarget.value});
        }
    }

    render(){
        return(
            <div className="registeration">
                <div className="form">
                    <h1 className="title">Register</h1>
                    <div className="input">
                        <TextField className="username" label="Username" onChange={this.onChange}/>
                        <div className="spaceBetween"></div>
                        <TextField className="password" type="password" label="Password" onChange={this.onChange}/>
                    </div>
                    <div className="formFooter">
                        <Button variant="contained" onClick={this.registerUser} color="primary">Register</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;