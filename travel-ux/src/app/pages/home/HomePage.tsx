import { CesiumMovementEvent, GeoJsonDataSource, Viewer, EventTarget, RootEventTarget } from 'resium';
import { Color, Viewer as ViewerCS, ColorMaterialProperty, GeoJsonDataSource as GeoJsonDataSource_2, Ion } from 'cesium';

import countries from '../../../resources/countries.json'
import usStates from '../../../resources/us-states.json'
import React from 'react';
import { Feature } from 'geojson';
import { featureCollectionFromListOfFeatures } from '../../data/utils/GeoJsonUtil';
import { getLoggedInUser, logout } from '../../data/services/UserService';
import { Travel as TravelData, User } from '../../data/generated';
import { getTravelClient } from '../../data/api/ApiAccess';
import Travel from '../../components/Travel/Travel';
import Timeline from 'react-lms-vis-timeline';

import './HomePage.css';
import { dateFromString } from 'src/app/data/utils/DateUtil';
import { TimelineGroup, TimelineItem } from 'src/app/data/types/timeline';
import { Col, Container, Row } from 'react-bootstrap';

interface HomePageProps {
  
}
interface HomePageState {
  records:Record[],
  user:User,
  selectedEntityId:string|number|undefined,
  selectedTravelId:number|undefined,
  selectedTravel:TravelData[],
  timelineGroups:any[],
  timelineItems:any[],
}

interface Record {
  boundary:Feature[],
  travelRecords:TravelData[]
}

class HomePage extends React.Component<HomePageProps, HomePageState> {

  
  private timelineReference: React.RefObject<Timeline>;
  private cesiumReference: ViewerCS | null | undefined;

  state:HomePageState = {
    records:[],
    user:{"username":""},
    selectedEntityId:undefined,
    selectedTravelId:undefined,
    selectedTravel:[],
    timelineGroups:[],
    timelineItems:[],
  }

  constructor(props:HomePageProps) {
    super(props);
    this.timelineReference = React.createRef();
  }

  checkClickMainViewer = (movement: CesiumMovementEvent, target: RootEventTarget):void => {
    if(!target) {
      this.setState({"selectedEntityId":undefined, "selectedTravel":this.state.records.flatMap(record=>record.travelRecords).sort((a,b)=>dateFromString(a.dateStart) > dateFromString(b.dateStart)?1:-1)}, ()=> {
        this.timelinePopulate(this.state.records.flatMap(record=>record.travelRecords));
        this.cesiumReference?.camera.flyHome();
      });
    }
  }

  entityClick = (movement: CesiumMovementEvent, target: EventTarget):void => 	{
    let selectedId = target.id.id.split("_")[0];
    let travelRecordsTmp = this.state.records.filter(record=>record.boundary[0].id === selectedId)
        .flatMap(record=>record.travelRecords).sort((a,b)=>dateFromString(a.dateStart) > dateFromString(b.dateStart)?1:-1);
    this.setState({"selectedEntityId":selectedId, "selectedTravel":travelRecordsTmp}, ()=>{
      this.timelinePopulate(this.state.selectedTravel);
    });
  }

  itemSelect = (items:any) => {
    console.log(items.items[0])
    if(items.items.length > 0) {
      let selectedEntityIdTmp = this.state.records.find(record=>record.travelRecords.findIndex(travel=>travel.id === items.items[0]) !== -1)?.boundary[0].id;
      let selectedTravelTmp = [this.state.records.flatMap(record=>record.travelRecords).filter(travel=>travel.id === items.items[0])[0]].sort((a,b)=>dateFromString(a.dateStart) > dateFromString(b.dateStart)?1:-1)
      this.setState({"selectedEntityId":selectedEntityIdTmp, "selectedTravelId":selectedTravelTmp[0].id, "selectedTravel":selectedTravelTmp}, ()=>{
        this.timelinePopulate(this.state.selectedTravel);
      })
    } else {
      this.setState({"selectedEntityId":undefined, "selectedTravelId":undefined, "selectedTravel":this.state.records.flatMap(record=>record.travelRecords).sort((a,b)=>dateFromString(a.dateStart) > dateFromString(b.dateStart)?1:-1)}, ()=>{
        this.timelinePopulate(this.state.records.flatMap(record=>record.travelRecords));
      });
    }
  }

  unique = (array:any[], propertyName:any) => {
    return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
  }


  redrawTimeline() {
    if(this.timelineReference.current){
      this.delay(1).then(() => {
        if(this.timelineReference.current) {
          console.log((this.timelineReference.current.timeline as any));
          (this.timelineReference.current.timeline as any).dom.container.style["flex"] = "1 1 auto";
          this.timelineReference.current.timeline.fit();
          this.timelineReference.current.timeline.redraw();
          this.delay(1).then(() => {
            if(this.timelineReference.current) {
              this.timelineReference.current.timeline.fit();
              this.timelineReference.current.timeline.redraw();
            }
          })
        }
      });
    }
  }

  timelinePopulate(travelRecords:TravelData[]) {
    let groups:TimelineGroup[] = this.unique(travelRecords.map(travel=>travel.user?.username).map(username=>{return {"id":username, "content":username}}), "id");
    let timelineItems:TimelineItem[] = travelRecords.map(travel => {return {"start":dateFromString(travel.dateStart), "end":dateFromString(travel.dateEnd), "id":travel.id ? travel.id : 1, "type":"box", "content":travel.country === "USA" ? (travel.state ? "USA/" + travel.state : "") : (travel.country ? travel.country : ""), "group":travel.user?.username}});

    
    this.setState({
      "timelineGroups":groups,
      "timelineItems":timelineItems,
    }, ()=> {
      this.redrawTimeline();
    });
    
  }

  delay = (ms:number) => {
    return new Promise(res => setTimeout(res, ms))
  };

  defaultHomePage() {
    if(this.state.records.length > 0 || this.state.timelineItems.length > 0) {
      this.setState({"records":[],"selectedTravel":[],"timelineItems":[],"timelineGroups":[],"selectedEntityId":undefined,"selectedTravelId":undefined});
    }
    this.cesiumReference?.camera.flyHome();
    this.redrawTimeline();
  }

  componentDidUpdate(prevProps: Readonly<HomePageProps>, prevState: Readonly<HomePageState>, snapshot?: any): void {
    if(getLoggedInUser().username === "") {
      this.defaultHomePage();
    }
  }

  componentDidMount() {
    Ion.defaultAccessToken = process.env.REACT_APP_ION_ACCESS_TOKEN || '';
    console.log("ComponoentDidMount");
    
    if(getLoggedInUser().username !== "") {
        if(this.state.user.username !== getLoggedInUser().username) {
        this.setState({"user":getLoggedInUser()}, ()=> {
          getTravelClient().getAllTravel().then(data=>{
            if(data && data.length > 0) {
              let boundaries:Feature[] = countries.features.filter(country=>country.id !== "USA" && data.map(travel=>travel.country).findIndex(c=>country.id === c) > -1).map(country=>country as Feature);
              boundaries = [...boundaries, ...usStates.features.filter(state=>data.findIndex(s=>s.country === "USA" && state.id === s.state) > -1).map(country=>country as Feature)]

              let records:Record[] = boundaries.map(boundary => {
                return {"boundary":[boundary],
                        "travelRecords":data.filter(travel=> travel.country === boundary.id || (travel.country === "USA" && travel.state === boundary.id)),
                };
              });
              this.setState({"records":records, "selectedTravel":records.flatMap(record=>record.travelRecords).sort((a,b)=>dateFromString(a.dateStart) > dateFromString(b.dateStart)?1:-1)}, ()=> {
                this.timelinePopulate(this.state.records.flatMap(record=>record.travelRecords));
              });
            }
          }).catch(e=> {
            console.log(e);
            logout();
            this.defaultHomePage();
          });
        });
      }
    } else {
      this.defaultHomePage();
    }
  }

  entityLoad(source:GeoJsonDataSource_2) {
    
    source.entities.values.forEach(entity => {
      if(entity.polygon) {
        if(this.state.selectedEntityId && entity.id.split("_")[0] === this.state.selectedEntityId) {
          this.cesiumReference?.flyTo(entity);
          entity.polygon.material = new ColorMaterialProperty(Color.BLUE.withAlpha(0.2));
        } else {
          entity.polygon.material = new ColorMaterialProperty(Color.YELLOW.withAlpha(0.2));
        }
      }
    });
  }


  render() {


    return (
      <>
        <div className="homepageContainer">
          <div className="timelineContainer">
            <div className="userSelector">
              <Container>
                <Row>
                  <Col className="userSelectorHeader">User Travel Selector</Col>
                </Row>
              </Container>
            </div>
            <Timeline 
              ref={this.timelineReference}
              selectHandler={this.itemSelect} 
              key={Math.random()*9999}  
              initialGroups={this.state.timelineGroups}
              initialItems={this.state.timelineItems} 
              options={
                {
                  "height":263,
                  "verticalScroll":true,
                  "preferZoom":true,
                }
              }/>
          </div>
          <div className="travelAndMapContainer">
            <div className="travelPanelContainer">
              <div className="travelPanel">
                    <div className="travelRecordPanel">
                        {this.state.selectedTravel.map(travel=>(
                            <div onClick={e => (this.setState({"selectedTravel":[travel], "selectedEntityId": this.state.records.find(record=>record.travelRecords.findIndex(tr=>tr.id === travel.id) !== -1)?.boundary[0].id}, ()=>this.timelinePopulate([travel])))} className="travelRecord">
                                <div>{travel.country}</div>
                                <div>{dateFromString(travel.dateStart?.toString()).toISOString()}</div>
                                <div>{travel.dateEnd?.toString()}</div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                    <Travel travelRecords={this.state.selectedTravel}/>
                </div>
            </div>
            <div className="mapContainer">
              <Viewer 
                style={{
                  width:"420px",
                  height:"420px"
                }}
                ref={e => {
                  this.cesiumReference = e && e.cesiumElement;
                }}
                scene3DOnly={true}
                geocoder={false}
                animation={false} 
                timeline={false}
                infoBox={false}
                fullscreenButton={false}
                navigationHelpButton={false}
                selectionIndicator={false}
                onClick={this.checkClickMainViewer}
              >
                {this.state.records.map((record)=> (
                  <GeoJsonDataSource onClick={this.entityClick} fill={Color.YELLOW.withAlpha(0.2)} onLoading={(entity)=>this.entityLoad(entity)} key={record.boundary[0].id} data={featureCollectionFromListOfFeatures(record.boundary)}/>
                ))}
              </Viewer>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
