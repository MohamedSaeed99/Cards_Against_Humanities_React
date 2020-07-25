import React, { Component } from 'react';
import './search.css'; 
import { TextField } from '@material-ui/core';

class Search extends Component {
    constructor (props){
        super(props)
        this.state = {
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            hosts: [],
            user_input: "",
        }
    }


    componentDidMount() {
        this.getHosts();
    }
    
    
    getHosts = () => {
        fetch('/lobby/users/host', {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            }
        }).then((response) => {
            response.json().then((body) => {
                this.setState({
                    hosts: body.hosts
                });
            });
        });
    }


    // Stores the value of the user input
    onChange = (event) => {
        const hosts = this.state.hosts;
        const userInput = event.currentTarget.value;

        // filters out suggestions based on input
        let filteredSuggestions = [];
        if(hosts === undefined){
            filteredSuggestions = [];
        }
        else{
            filteredSuggestions = hosts.filter(
                (suggestions) =>{
                return suggestions.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
                }
            );
        }

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            user_input: event.currentTarget.value,
        });

    }


    renderSuggestions = () => {
        const {
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                user_input, 
            }
        } = this;

        let suggestionList;

        // checks for if there is input and suggestions avaliable
        if(showSuggestions && user_input) {
            // checks if the filter found something
            if(filteredSuggestions.length) {
                suggestionList = (
                        <ul className="suggestions">
                        
                        {filteredSuggestions.map((suggestion, index)=>{
                            let className;
                            if(index === activeSuggestion){
                                className = "suggestion-active"
                            }
                            return (
                                <li
                                    className={className}
                                    key={suggestion}
                                    onClick={this.getInput}
                                    onKeyDown={this.onEnterPress}
                                >
                                    {suggestion}
                                </li>
                            );
                        })}

                    </ul>
                );
            }
        }
        return suggestionList;
    }


    getInput = (event) => {
        this.setState({
            user_input: event.currentTarget.innerText,
            filteredSuggestions: [],
            showSuggestions: false
        }, () => {
            this.props.retrieveUserInput(this.state.user_input)
        });
    }


    onEnterPress = (event) => {
        console.log("Enret press")
        if (event.keyCode === 13) {
            console.log("Enret press")
            this.setState({
                user_input: event.currentTarget.innerText,
                filteredSuggestions: [],
                showSuggestions: false
            }, () => {
                this.props.retrieveUserInput(this.state.user_input)
            });
        }
    }


    render() {
        return (
            <div>
                <TextField 
                    id="outlined-search" 
                    label="Search" 
                    type="search"
                    variant="outlined"
                    onChange={this.onChange}
                    value={this.state.user_input}
                />
                <div className="autocompleteList">{this.renderSuggestions()}</div>
            </div>
        )
    }
}

export default Search;