import React from 'react';
import { deregisterUserConsumer, logout, registerAsUserConsumer, retrieveUser } from '../../data/services/UserService';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import "./Navigation.css";
import { UserConsumerState } from 'src/app/data/providers/UserProvider/UserProvider';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import DropDown from '../DropDown/DropDown';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface NavigationCompProps {
    navigation:NavigateFunction,
}

interface NavigationCompState extends UserConsumerState {

}

interface NavigationProps {

}


function Navigation(props:NavigationProps) {
    const navigation = useNavigate();
    return <NavigationComp navigation={navigation}/>;
}

class NavigationComp extends React.Component<NavigationCompProps, NavigationCompState>{

    private navigation:NavigateFunction = this.props.navigation;


    constructor(props:NavigationCompProps) {
        super(props);
        this.state = {"userConsumerKey" : registerAsUserConsumer(this, null), "user":retrieveUser()};
    }

    componentWillUnmount(): void {
        deregisterUserConsumer(this.state.userConsumerKey);
    }


    render() {

        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Container maxWidth="xl">
                        <Toolbar>
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 3,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'system-ui',
                                    fontWeight: 700,
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Travel Tracker
                            </Typography>
                            <Typography
                                variant="body1"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    flexGrow: this.state.user.username === "" ? 1 : 0,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'system-ui',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Home
                            </Typography>
                            {this.state.user.username !== "" ?(
                                <DropDown dropdownName="Input Travel" 
                                          endIcon={<ArrowDropDownIcon/>}
                                          dropdownRecords={[
                                            {
                                                "recordName":"Import From File",
                                                "link":"/travel/fromFile"
                                            },
                                            {
                                                "recordName":"Create in App",
                                                "link":"/travel/create"
                                            }
                                          ]}
                                          />
                                ):<></>}
                            {this.state.user.username !== "" ?
                                <DropDown dropdownName={this.state.user.username} 
                                          endIcon={<ArrowDropDownIcon/>}
                                          dropdownRecords={[
                                            {
                                                "recordName":"User Settings",
                                                "link":"/user/settings"
                                            },
                                            {
                                                "recordName":"Logout",
                                                "action":logout
                                            }
                                          ]}
                                          justifyRight
                                          />
                                :
                                <div style={{"flexGrow":"1", "justifyContent":"flex-end", "display":"flex"}}>
                                    <Typography
                                        variant="body1"
                                        noWrap
                                        component="a"
                                        href="/login"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'system-ui',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >Login</Typography>
                                </div>
                                }
                        </Toolbar>
                    </Container>
                </AppBar>
            </Box>
        )
    }
}



export default Navigation;