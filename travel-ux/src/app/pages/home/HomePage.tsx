import './HomePage.css';

import Container from 'react-bootstrap/Container';

import { GeoJsonDataSource, Viewer } from 'resium';
import { Ion } from 'cesium';

import countries from '../../../resources/countries.json'
import usStates from '../../../resources/us-states.json'
import React from 'react';
import { Feature, FeatureCollection } from 'geojson';
import { featureCollectionFromListOfFeatures } from '../../data/utils/GeoJsonUtil';


interface HomePageProps {

}
interface HomePageState {
  "selectedCountries":FeatureCollection,
  "selectedStates":FeatureCollection
}

class HomePage extends React.Component<HomePageProps, HomePageState> {

  

  state:HomePageState = {
    "selectedCountries":featureCollectionFromListOfFeatures(countries.features as Feature[]),
    "selectedStates":featureCollectionFromListOfFeatures(usStates.features as Feature[])
  }


  render() {

    Ion.defaultAccessToken = process.env.REACT_APP_ION_ACCESS_TOKEN || '';




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