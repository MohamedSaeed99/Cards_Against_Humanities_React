import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import './form.css';

class Register extends Component{

    constructor(){
        super();
        this.state ={
            errorMessage: null,
            redirectTo: null,
            user_username: "",
            user_password: ""
        }
    }

    // Makes post request to 
    registerUser = () => {
        var payload = {
            username: this.state.user_username.replace(" ", ""),
            password: this.state.user_password
        }        
        fetch("/register/", {
            method: "POST",
            headers: {
                'Content-type': "application/json",
                Accept:'application/json',
            },
            
            body: JSON.stringify(payload)

        }).then((response)=>{
            response.json().then((body) => {
                if(body.success){
                    this.props.onRegisterChange(true, body.user);

                    this.setState({redirectTo: "/"});
                }
                else {
                    this.setState({errorMessage: body.message})
                }
            });
        });
    }

    // Stores the state of current user input
    onChange = (event) => {
        if(event.currentTarget.type === "password"){
            if(!event.currentTarget.value.includes("<") && !event.currentTarget.value.includes(">")){ 
                this.setState({user_password: event.currentTarget.value});
            }
            else {
                this.setState({
                    errorMessage: "Invalid token '<', '>', or '/' read",
                    user_password: this.state.user_password});
            }
        }
        else{
            if(!event.currentTarget.value.includes("<") && !event.currentTarget.value.includes(">") && !event.currentTarget.value.includes("/")){ 
                this.setState({user_username: event.currentTarget.value});
            }
            else {
                this.setState({user_username: this.state.user_username});
            }
        }
    }

    render(){
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />;
        }
        return(
            <div className="registeration">
                <div className="form">
                    <h1 className="title">Register</h1>
                    {this.state.errorMessage ? <Alert className="msg" variant="filled" severity="error">{this.state.errorMessage}</Alert>:<p></p>}
                    <div className="input">
                        <TextField className="username" label="Username" onChange={this.onChange} value={this.state.user_username}/>
                        <div className="spaceBetween"></div>
                        <TextField className="password" type="password" label="Password" onChange={this.onChange} value={this.state.user_password}/>
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