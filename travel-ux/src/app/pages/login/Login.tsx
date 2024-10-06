

import React from 'react';

import './Login.css';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { AppBar, Box, Container, Tab, Tabs } from '@mui/material';
import TabPanel from 'src/app/components/TabPanel/TabPanel';
import LoginPanel from './LoginPanel/LoginPanel';
import { User } from 'src/app/data/generated';
import RegisterPanel from './RegisterPanel/RegisterPanel';



interface LoginCompProps {
    navigation:NavigateFunction,
}

interface LoginCompState {
    autofillUser:string | undefined,
    loginActive:boolean,
}

interface LoginProps {

}


function Login(props:LoginProps) {
    const navigation = useNavigate();

    return <LoginComp {...props} navigation={navigation} />;
}

class LoginComp extends React.Component<LoginCompProps, LoginCompState> {

    private navigate:NavigateFunction = this.props.navigation;

    constructor(props:LoginCompProps) {
        super(props);
        this.state = {autofillUser: undefined, loginActive:true};
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }

    private navigateHome = () => {
        this.navigate("/");
    }

    handleSelectedTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({loginActive: newValue===0});
    };

    onLogin(user:User) {
        this.navigateHome();
    }

    onRegister(user:User) {
        this.setState({autofillUser: user.username}, ()=>{
            this.setState({loginActive: true});
        });
    }

    render() {
        const loginActive = this.state.loginActive;
        return (
            <Container>
                <div className="loginContainer">
                    <div className="loginWindow">
                        <Box sx={{ bgcolor: 'background.paper' }}>
                            <AppBar position="static">
                                <Tabs
                                    value={loginActive?0:1}
                                    onChange={this.handleSelectedTabChange}
                                    indicatorColor="secondary"
                                    textColor="inherit"
                                    variant="fullWidth"
                                >
                                    <Tab label="Login"/>
                                    <Tab label="Register"/>
                                </Tabs>
                            </AppBar>
                        
                            <TabPanel selected={loginActive}>
                                <LoginPanel autofillUsername={this.state.autofillUser} onLogin={this.onLogin} />
                            </TabPanel>
                            <TabPanel selected={!loginActive}>
                                <RegisterPanel onRegister={this.onRegister} />
                            </TabPanel>
                        </Box>
                    </div>
                </div>  
            </Container>
        );
    }
}

export default Login;