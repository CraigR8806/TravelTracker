import './HomePage.css';

import Container from 'react-bootstrap/Container';

import { GeoJsonDataSource, Viewer } from 'resium';
import { Ion } from 'cesium';

import countries from '../../../resources/countries.json'
import usStates from '../../../resources/us-states.json'
import React from 'react';
import { Feature, FeatureCollection } from 'geojson';
import { featureCollectionFromListOfFeatures } from '../../data/utils/GeoJsonUtil';
import { getLoggedInUser } from '../../data/services/UserService';
import { User } from '../../data/generated';
import { getTravelClient } from '../../data/api/ApiAccess';


interface HomePageProps {
  
}
interface HomePageState {
  selectedCountries:FeatureCollection,
  selectedStates:FeatureCollection,
  user:User
}

class HomePage extends React.Component<HomePageProps, HomePageState> {

  

  state:HomePageState = {
    "selectedCountries":featureCollectionFromListOfFeatures([]),
    "selectedStates":featureCollectionFromListOfFeatures([]),
    "user":{"username":""}
  }


  render() {

    Ion.defaultAccessToken = process.env.REACT_APP_ION_ACCESS_TOKEN || '';

    if(getLoggedInUser() && this.state.user.username !== getLoggedInUser().username) {
      this.setState({"user":getLoggedInUser()}, ()=> {
        getTravelClient().getAllTravel().then(data=>{
          let travelCountries:(string|undefined)[] = data.map(travel=>travel.country);
          this.setState({
            "selectedCountries":featureCollectionFromListOfFeatures(
              countries.features.filter(
                country=>travelCountries.indexOf(country.id)>-1) as Feature[])
          });
        }).catch(e=>
          console.log(e)
        );
      });
    }


    return (
      <Container>
        
          <Viewer 
            animation={false} 
            timeline={false}
          
          >
            <GeoJsonDataSource data={this.state.selectedCountries}/>
            <GeoJsonDataSource data={this.state.selectedStates}/>
          </Viewer>
      </Container>
    );
  }
}

export default HomePage;