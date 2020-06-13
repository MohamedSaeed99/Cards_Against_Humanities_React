import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Home from './components/home/home';
import Nav from './components/navigation/nav';
import Register from './components/forms/register';
import Login from './components/forms/login';
import Game from './components/game/game';


class App extends Component {
  constructor (){
    super();
    this.state = {
      username: null,
      game: null,
      loggedIn: false,
      inGame: false
    }
  }

  onChange = (status, username) => {
    this.setState({
      loggedIn: status,
      username: username
    });
  } 

  joinedGame = (joined, gameId) => {
    this.setState({
      inGame: joined,
      game: gameId
    });
  } 

  render() {
    return (
      <div style={{height: 0, margin:0, padding:0}}>
        <Nav 
          onLogoutChange={this.onChange} 
          onLeaveGame={this.joinedGame} 
          joinedGame={this.state.inGame} 
          loggedIn={this.state.loggedIn} 
          username={this.state.username}
          gameId={this.state.game}>
        </Nav>
        <Route exact path="/" render={() => <Home 
                                              loggedIn={this.state.loggedIn} 
                                              username={this.state.username} 
                                              onJoinGame={this.joinedGame} />} />
        <Route exact path="/register" render={() => <Register onRegisterChange={this.onChange} />} />
        <Route exact path="/login" render={() => <Login onLoginChange={this.onChange}/>} />
        <Route exact path="/game" render={() => <Game />} />
      </div>
    );
  }
}

export default App;
