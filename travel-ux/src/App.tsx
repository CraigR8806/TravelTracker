// import React from 'react';
import HomePage from './app/pages/home/HomePage';
import Navigation from './app/components/Navigation/Navigation';
import './App.css';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './app/pages/login/Login';
import React from 'react';
import Settings from './app/pages/settings/Settings';
import TravelFromFile from './app/pages/traveFromFile/TravelFromFile';


interface AppProps {

}
interface AppState {

}



class App extends React.Component<AppProps, AppState> {

  render(){
    return (
      <Router>
        <div className="mainContainer">
          <div className="navContainer">
            <Navigation/>
          </div>
          <div className="routeContainer">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/travel/fromFile" element={<TravelFromFile/>}/>
          </Routes>
          </div>
        </div>
        
      </Router>
    );
  } 
}

export default App;
