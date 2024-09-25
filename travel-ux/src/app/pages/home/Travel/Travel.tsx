import React from 'react';

import './Travel.css';

import { Travel as TravelData } from '../../../data/generated/models/Travel';


interface TravelProps  {
    travelRecords:TravelData[]
}

interface TravelState  {

}

class Travel extends React.Component<TravelProps, TravelState> {


    render(){
        return(
            <></>
        );
    } 

}

export default Travel;