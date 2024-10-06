import './Travel.css';

import { Travel as TravelData } from '../../data/generated/models/Travel';
import TabBar from '../TabBar/TabBar';
import InfoIcon from '../Icons/InfoIcon/InfoIcon';
import MoneyIcon from '../Icons/MoneyIcon/MoneyIcon';
import StatsIcon from '../Icons/StatsIcon/StatsIcon';
import TravelPanelProps from './TravelPanel/travelpanel';
import ChargesPanel from './TravelPanel/ChargesPanel/ChargesPanel';
import InfoPanel from './TravelPanel/InfoPanel/InfoPanel';
import StatsPanel from './TravelPanel/StatsPanel/StatsPanel';
import React, { ReactElement } from 'react';
import { Grid2 } from '@mui/material';


interface TravelProps  {
    travelRecords:TravelData[]
}

interface TravelState  {
    selectedTab:number
}

class Travel extends React.Component<TravelProps, TravelState> {

    private panels:(()=>ReactElement<TravelPanelProps>)[] = [()=><InfoPanel travelData={this.props.travelRecords}/>,
                                                             ()=><ChargesPanel travelData={this.props.travelRecords}/>,
                                                             ()=><StatsPanel  travelData={this.props.travelRecords}/>];

    constructor(props:TravelProps) {
        super(props);
        this.tabSelected = this.tabSelected.bind(this);
    }

    state:TravelState = {
        "selectedTab":0
    }

    tabSelected = (index:number) => {
        this.setState({"selectedTab":index});
    }

    render(){
        return(
            <Grid2 sx={{height:"100%"}} className="travelInfoAndTabPanel">
                <Grid2 sx={{flexGrow:1}} size={12} className="travelInfoPanel">
                    {this.panels[this.state.selectedTab]()}
                </Grid2>
                <Grid2 sx={{alignSelf:"flex-end", width:"100%"}} size={12} className="travelInfoTabRow">
                    <TabBar tabSelected={this.tabSelected}
                            backgroundColor={"#330036"}
                            svgColor={"#96A0A2"}
                            highlightBackgroundColor={"#96A0A2"}
                            highlightSvgColor={"#330036"}>
                        {InfoIcon}
                        {MoneyIcon}
                        {StatsIcon}
                    </TabBar>
                </Grid2>
            </Grid2>
        );
    } 

}

export default Travel;