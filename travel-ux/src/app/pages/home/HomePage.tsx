import './HomePage.css';

import Container from 'react-bootstrap/Container';

import { CesiumMovementEvent, GeoJsonDataSource, Viewer, EventTarget, RootEventTarget} from 'resium';
import { Color, Ion  } from 'cesium';

import countries from '../../../resources/countries.json'
import usStates from '../../../resources/us-states.json'
import React from 'react';
import { Feature } from 'geojson';
import { featureCollectionFromListOfFeatures } from '../../data/utils/GeoJsonUtil';
import { getLoggedInUser } from '../../data/services/UserService';
import { Travel, User } from '../../data/generated';
import { getTravelClient } from '../../data/api/ApiAccess';



interface HomePageProps {
  
}
interface HomePageState {
  records:Record[],
  user:User
}

interface Record {
  boundary:Feature[],
  selected:boolean,
  travelRecords:Travel[]
}

class HomePage extends React.Component<HomePageProps, HomePageState> {

  

  state:HomePageState = {
    records:[],
    user:{"username":""},
  }

  checkClickMainViewer = (movement: CesiumMovementEvent, target: RootEventTarget):void => {
    if(!target) {
      let recordsTmp:Record[] = this.state.records;
      let alreadySelectedItem = recordsTmp[recordsTmp.findIndex(record=>record.selected)];
      if(alreadySelectedItem){
        recordsTmp[recordsTmp.findIndex(record=>record.selected)].selected = false;
      }
      this.setState({
        "records":[...recordsTmp]
      });
    }
  }

  selectCountry(selectedId:string):void {
    let recordsTmp:Record[] = this.state.records;
    let alreadySelectedItem = recordsTmp[recordsTmp.findIndex(record=>record.selected)];
    if(alreadySelectedItem){
      recordsTmp[recordsTmp.findIndex(record=>record.selected)].selected = false;
    }
    
    recordsTmp[recordsTmp.findIndex(record=>record.boundary[0].id === selectedId)].selected = true;
    console.log(recordsTmp);

    this.setState({"records":recordsTmp});
  }

  entityClick = (movement: CesiumMovementEvent, target: EventTarget):void => 	{

    let selectedId:string = target.id.id.split("_")[0];
    
    this.selectCountry(selectedId);
    
  }

  

  componentDidMount() {
    Ion.defaultAccessToken = process.env.REACT_APP_ION_ACCESS_TOKEN || '';
    if(getLoggedInUser() && this.state.user.username !== getLoggedInUser().username) {
      this.setState({"user":getLoggedInUser()}, ()=> {
        getTravelClient().getAllTravel().then(data=>{
          if(data && data.length > 0) {
            let boundaries:Feature[] = countries.features.filter(country=>country.id !== "USA" && data.map(travel=>travel.country).findIndex(c=>country.id === c) > -1).map(country=>country as Feature);
            boundaries = [...boundaries, ...usStates.features.filter(state=>data.findIndex(s=>s.country === "USA" && state.id === s.state) > -1).map(country=>country as Feature)]
            
            let records:Record[] = boundaries.map(boundary => {
              return {"boundary":[boundary],
                      "travelRecords":data.filter(travel=> travel.country === boundary.id || travel.state === boundary.id),
                      "selected":false
              };
            });
            this.setState({"records":records});
          }
        }).catch(e=> {
          console.log(e);
          this.setState({"records":[]});
        });
      });
    }
  }
  


  render() {

    return (
      <Container>
        
          <Viewer 
            animation={false} 
            timeline={false}
            infoBox={false}
            fullscreenButton={false}
            navigationHelpButton={false}
            selectionIndicator={false}
            onClick={this.checkClickMainViewer}
          >
            {this.state.records.map((record)=> (
              <GeoJsonDataSource onClick={this.entityClick} fill={record.selected?new Color(0,0,1,0.3):new Color(1,1,0,0.3)} stroke={record.selected?Color.ORANGE:Color.YELLOW} data={featureCollectionFromListOfFeatures(record.boundary)} />
            ))}
          </Viewer>
      </Container>
    );
  }
}

export default HomePage;