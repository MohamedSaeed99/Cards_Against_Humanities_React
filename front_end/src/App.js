import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import Home from './components/home/home';
import Nav from './components/navigation/nav';
import Register from './components/forms/register';
import Login from './components/forms/login';
import Game from './components/game/game';
import openSocket from 'socket.io-client';



class App extends Component {
  constructor (){
    super();
    this.state = {
      loggedIn: false,
      inGame: false,
      username: null,
      game: null,
      socket: openSocket('http://localhost:' + (process.env.PORT || 3001)),
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
      game: gameId,
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
          gameId={this.state.game}
          socket={this.state.socket}>
        </Nav>
        <Route exact path="/" render={() => <Home 
                                              loggedIn={this.state.loggedIn} 
                                              username={this.state.username} 
                                              onJoinGame={this.joinedGame}
                                              socket={this.state.socket} />} />
        <Route exact path="/register" render={() => <Register onRegisterChange={this.onChange} />} />
        <Route exact path="/login" render={() => <Login onLoginChange={this.onChange}/>} />
        <Route exact path="/game" render={() => <Game
                                                  onLeaveGame={this.joinedGame}
                                                  socket={this.state.socket} 
                                                  gameId={this.state.game}
                                                  username={this.state.username} />} />
      </div>
    );
  }
}

export default App;
