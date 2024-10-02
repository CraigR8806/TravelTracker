
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


import React from 'react';
import { deregisterUserConsumer, logout, registerAsUserConsumer, retrieveUser } from '../../data/services/UserService';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import "./Navigation.css";
import { UserConsumerState } from 'src/app/data/providers/UserProvider/UserProvider';

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

        return <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Travel Tracker</Navbar.Brand>
                <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown hidden={this.state.user.username === ""} title="Input Travel" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/travel/fromFile">Import from File</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Create in App</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Nav className="justify-content-end" activeKey="/">
                    <NavDropdown align="start" drop="down-centered" hidden={this.state.user.username === ""} title={this.state.user.username} id="basic-nav-dropdown">
                        <NavDropdown.Item href="/settings">User Settings</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>logout()}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Item hidden={this.state.user.username !== ""}>
                        <Nav.Link href="/login">Login</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    }
}



export default Navigation;