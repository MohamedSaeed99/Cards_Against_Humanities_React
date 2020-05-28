import React, { Component } from 'react';

class Home extends Component {
    constructor(){
        super();
        this.state={
            loggedIn: false,
            lobbies: []
        };
    }

    render(){
        return(
            <div>
                <h1>Hello World</h1>
            </div>
        );
    }
}

export default Home;