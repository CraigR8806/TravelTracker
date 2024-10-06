import { Menu, MenuItem, Typography, Button, PopoverVirtualElement, PopoverOrigin } from '@mui/material';

import { Component } from 'react';


interface DropDownRecord {
    recordName:string,
    link?:string,
    action?:()=>void
}


interface DropDownProps {
    dropdownName:string,
    dropdownRecords:DropDownRecord[],
    endIcon?:React.ReactNode,
    justifyRight?:boolean,
}

interface DropDownState {
    anchorEl:Element | (() => Element) | PopoverVirtualElement | (() => PopoverVirtualElement) | null | undefined,
    outerDivStyle:React.CSSProperties,
    menuAnchorOrigin?:PopoverOrigin,
    menuTransformOrigin?:PopoverOrigin
}

class DropDown extends Component<DropDownProps, DropDownState> {

    private buttonId:string = (Math.random()*9999).toString();
    private menuId:string = (Math.random()*9999).toString();

    constructor(props:DropDownProps) {
        super(props);
        let tmpState:React.CSSProperties = {};
        let tmpAnchorOrigin:PopoverOrigin = {
            vertical: 'bottom',
            horizontal: 'left',
        };
        let tmpTransformOrigin:PopoverOrigin = {
            vertical: 'top',
            horizontal: 'left',
        };

        if(this.props.justifyRight){
            tmpState = {...tmpState, "display":"flex", "flexGrow":"1", "justifyContent":"flex-end"};
            tmpAnchorOrigin = {
                vertical: 'bottom',
                horizontal: 'right',
            }
            tmpTransformOrigin = {
                vertical: 'top',
                horizontal: 'right',
            }
        }

        this.state = {
            anchorEl:null,
            outerDivStyle:tmpState,
            menuAnchorOrigin:tmpAnchorOrigin,
            menuTransformOrigin:tmpTransformOrigin,
        }
    }


    handleClick = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({"anchorEl":event.currentTarget});
    };

    handleClose = () => {
        this.setState({"anchorEl":null});
    };



    render() {
        return (
            <div style={this.state.outerDivStyle}>
                <Button
                    id={this.buttonId}
                    aria-controls={this.state.anchorEl ? this.menuId : undefined}
                    aria-haspopup="true"
                    aria-expanded={this.state.anchorEl ? 'true' : undefined}
                    sx={{
                        fontFamily: 'system-ui',
                        color: 'inherit',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: '400',
                        letterSpacing: '0.00938em' 
                    }}
                    onClick={this.handleClick}
                >
                    {this.props.dropdownName}{this.props.endIcon}
                </Button>
                <Menu
                    id={this.menuId}
                    anchorEl={this.state.anchorEl}
                    open={this.state.anchorEl?true:false}
                    onClose={this.handleClose}
                    MenuListProps={{
                        'aria-labelledby': this.buttonId,
                    }}
                    anchorOrigin={this.state.menuAnchorOrigin}
                    transformOrigin={this.state.menuTransformOrigin}
                >
                    {this.props.dropdownRecords.map(record=>(
                        <MenuItem onClick={record.action?record.action:this.handleClose}>
                            <Typography
                                variant="body1"
                                noWrap
                                component="a"
                                href={record.action?'':record.link}
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'system-ui',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >{record.recordName}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}



export default DropDown;