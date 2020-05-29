import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Nav from './components/navigation/nav';
import Register from './components/registeration/register';


class App extends Component {
  constructor (){
    super();
    this.state = {
      loggedIn: false,
      username: null,
    }
  }

  render() {
    return (
      <div style={{height: 0, margin:0, padding:0}}>
        <Nav></Nav>
        <Route exact path="/" render={() => <Home loggedIn={this.state.loggedIn} />} />
        <Route exact path="/register" render={() => <Register />} />
      </div>
    );
  }
}

export default App;
