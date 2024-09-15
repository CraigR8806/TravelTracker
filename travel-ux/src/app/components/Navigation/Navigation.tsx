
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


import React from 'react';
import { logout } from '../../data/services/UserService';
import App from '../../../App';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface NavigationCompProps {
    navigation:NavigateFunction,
    parentRef:App
}

interface NavigationCompState {

}

interface NavigationProps {
    parentRef:App
}


function Navigation(props:NavigationProps) {
    const navigation = useNavigate();
    return <NavigationComp navigation={navigation} parentRef={props.parentRef}/>;
}

class NavigationComp extends React.Component<NavigationCompProps, NavigationCompState>{

    private parentRef:App = this.props.parentRef;
    private navigation:NavigateFunction = this.props.navigation;


    logoutUser(me:NavigationComp){
        console.log(this);
        me.parentRef.setState({
            "loggedIn":false,
            "user":{"username":''}
        }, () => {
            logout();
            this.navigation("/");
        });
    }



    render() {

        return <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Travel Tracker</Navbar.Brand>
                <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown hidden={!this.props.parentRef.state.loggedIn} title="Input Travel" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/travel/fromFile">Import from File</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Create in App</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Nav className="justify-content-end" activeKey="/">
                    <NavDropdown align="start" drop="down-centered" hidden={!this.props.parentRef.state.loggedIn} title={this.props.parentRef.state.user.username} id="basic-nav-dropdown">
                        <NavDropdown.Item href="/settings">User Settings</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>this.logoutUser(this)}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item hidden={this.props.parentRef.state.loggedIn}>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    }
}



export default Navigation;