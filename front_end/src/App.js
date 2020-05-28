import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css'
import Home from './components/home'
import Nav from './components/navigation/nav'


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

        <BrowserRouter>
          <Route exact path="/" render={() => <Home loggedIn={this.state.loggedIn} />} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
