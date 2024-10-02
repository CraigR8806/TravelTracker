import { unique } from 'src/app/data/utils/Util';
import TravelPanelProps from '../travelpanel';
import './InfoPanel.css';
import { User } from 'src/app/data/generated';


// interface InfoPanelState {

// }
const InfoPanel:React.FC<TravelPanelProps> = (props:TravelPanelProps) => {



    let uniqueUsers:User[] = [];
    if(props.travelData) {
        uniqueUsers = unique(props.travelData.map(travel=>travel.user), "username");
    }
    return (
        
        <div className="infoPanelContainer">
            {props.travelData && props.travelData.length > 1?
                <div className="multipleTravelSelectedPanel">
                    <div>{props.travelData.length} Trips by {uniqueUsers.length}{uniqueUsers.length > 1?" Different":""} User{uniqueUsers.length > 1?"s":""}</div>
                </div>
                :
                <div>def</div>
            }
        </div>
    )
}

export default InfoPanel;