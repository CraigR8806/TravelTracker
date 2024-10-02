import { Component } from 'react';
import './TabBar.css';
import IconProps from '../../Icons/IconProps';
import { delay } from 'src/app/data/utils/Util';


interface TabBarProps {
    children:React.FC<IconProps>[],
    tabSelected:(index:number)=>void,
    backgroundColor:string,
    svgColor:string,
    highlightBackgroundColor:string,
    highlightSvgColor:string,
    selectedTab?:number,
}

interface TabBarState {
    highlightWidth:number,
    selectedTab:number,
    tabGroupName:string
}


class TabBar extends Component<TabBarProps, TabBarState> {

    constructor(props:TabBarProps) {
        super(props);
        this.state = {
            highlightWidth:(100/props.children.length),
            selectedTab:props.selectedTab || 0,
            tabGroupName:(Math.random()*9999).toString()
        };
    }

    private tabSelected = (index:number)=>{
        this.setState({selectedTab:index},()=>{
            this.props.tabSelected(index);
            delay(1).then(()=>this.markRadioAsChecked());
        });
    }

    private markRadioAsChecked() {
        document.documentElement.style.setProperty('--tab-slider-position', this.state.highlightWidth * this.state.selectedTab + "%");
        let thisRadio:any = document.getElementById("tabBarItem-" + this.state.selectedTab);
        if(thisRadio)
            thisRadio.checked = 'true';
    }

    componentDidMount() {
        this.markRadioAsChecked();
        document.documentElement.style.setProperty('--tab-background-color', this.props.backgroundColor);
        document.documentElement.style.setProperty('--tab-svg-color', this.props.svgColor);
        document.documentElement.style.setProperty('--tab-highlight-background-color', this.props.highlightBackgroundColor);
        document.documentElement.style.setProperty('--tab-highlight-svg-color', this.props.highlightSvgColor);
    }

    render() {

        
        return (
            <div className="tabBarContainer">
                <div style={{"--width" : this.state.highlightWidth + "%"} as React.CSSProperties} className="tabBarListTag">
                    {this.props.children.map((Icon, i)=>(
                        <div key={Math.random()*9999}>
                            <input className="tabBarRadioTag" type="radio" name={this.state.tabGroupName} id={"tabBarItem-" + i}/>
                            <label onClick={()=>this.tabSelected(i)} className="tabBarLabelTag">
                                <Icon svgClassName='tabBarSvgTag' />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TabBar;