// import React from 'react';
import HomePage from './app/pages/home/HomePage';
import Navigation from './app/components/Navigation/Navigation';
import './App.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './app/pages/login/Login';
import React from 'react';
import { getLoggedInUser, isLoggedIn } from './app/data/services/UserService';
import { User } from './app/data/generated';
import Settings from './app/pages/settings/Settings';
import TravelFromFile from './app/pages/traveFromFile/TravelFromFile';


interface AppProps {

}
interface AppState {
  "loggedIn":boolean,
  "user":User
}



class App extends React.Component<AppProps, AppState> {

  private clearedState:AppState = {
    "loggedIn":isLoggedIn(),
    "user":getLoggedInUser()
  }



  state:AppState = this.clearedState;

  render(){
    return (
      <Router>
        <Navigation parentRef={this}/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login parentRef={this} />} />
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/travel/fromFile" element={<TravelFromFile/>}/>
        </Routes>
      </Router>
    );
  } 
}

export default App;
