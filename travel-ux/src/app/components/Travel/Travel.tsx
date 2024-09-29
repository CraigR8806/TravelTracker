import React from 'react';

import './Travel.css';

import { Travel as TravelData } from '../../data/generated/models/Travel';
import { Container, Row } from 'react-bootstrap';
import TabBar from './TabBar/TabBar';
import InfoIcon from '../Icons/InfoIcon/InfoIcon';
import MoneyIcon from '../Icons/MoneyIcon/MoneyIcon';
import StatsIcon from '../Icons/StatsIcon/StatsIcon';


interface TravelProps  {
    travelRecords:TravelData[]
}

interface TravelState  {
    selectedTab:number
}

class Travel extends React.Component<TravelProps, TravelState> {

    constructor(props:TravelProps) {
        super(props);
        this.tabSelected = this.tabSelected.bind(this);
    }

    state:TravelState = {
        "selectedTab":0
    }

    tabSelected = (index:number) => {
        this.setState({"selectedTab":index}, ()=>{
            console.log(this.state.selectedTab);
        });
    }

    render(){
        return(
            <Container className="travelInfoAndTabPanel">
                <Row className="travelInfoPanel">

                </Row>
                <Row className="travelInfoTabRow">
                    <TabBar tabSelected={this.tabSelected}
                            backgroundColor={"#330036"}
                            svgColor={"#96A0A2"}
                            highlightBackgroundColor={"#96A0A2"}
                            highlightSvgColor={"#330036"}>
                        {InfoIcon}
                        {MoneyIcon}
                        {StatsIcon}
                    </TabBar>
                </Row>
            </Container>
        );
    } 

}

export default Travel;