import React, { Component } from 'react';
import './App.css';
import MainPage from './components/MainPage';
import MapPageContainer from './components/MapPageContainer';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
require('dotenv').config();


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={MainPage} />
        <Route
          path="/map"
          render={(props) => <MapPageContainer {...props} />}
        />


      </div>
    );
  }
}

export default App;
