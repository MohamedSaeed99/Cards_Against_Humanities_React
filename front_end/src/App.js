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
      isLoggedIn: false,
      isInGame: false,
      username: null,
      gameId: null,
      socket: openSocket('http://localhost:' + (process.env.PORT || 3001)),
    }
  }

  componentDidMount() {
    this.getInfoOnAuthStatus();
  }


  getInfoOnAuthStatus = function() {
    fetch("/login/", {
      method: "GET",
    }).then((response) => {
      response.json().then((body) => {
        if(body.isAuth){
          console.log(body);
          this.setState({
            isLoggedIn: true,
            username: body.user.username,
            gameId: body.user.gameId,
            isInGame: body.user.gameId === null ? false : true,
          });
        }
      })
    });
  }


  onUserLoginStatus = (status, username) => {
    this.setState({
      isLoggedIn: status,
      username: username
    });
  } 


  joinedGame = (joined, gameId) => {
    this.setState({
      isInGame: joined,
      gameId: gameId,
    });
  } 

  
  render() {
    return (
      <div style={{height: 0, margin:0, padding:0}}>
        <Nav 
          onUserLoginStatus={this.onUserLoginStatus} 
          onLeaveGame={this.joinedGame} 
          isInGame={this.state.isInGame} 
          isLoggedIn={this.state.isLoggedIn} 
          username={this.state.username}
          gameId={this.state.gameId}
          socket={this.state.socket} >
        </Nav>
        <Route exact path="/" render={() => <Home 
                                              isLoggedIn={this.state.isLoggedIn} 
                                              username={this.state.username} 
                                              onJoinGame={this.joinedGame}
                                              socket={this.state.socket} />} />
        <Route exact path="/register" render={() => <Register onRegisterChange={this.onUserLoginStatus} />} />
        <Route exact path="/login" render={() => <Login onLoginChange={this.onUserLoginStatus}/>} />
        <Route exact path="/game" render={() => <Game
                                                  onLeaveGame={this.joinedGame}
                                                  socket={this.state.socket} 
                                                  gameId={this.state.gameId}
                                                  username={this.state.username} />} />
      </div>
    );
  }
}

export default App;