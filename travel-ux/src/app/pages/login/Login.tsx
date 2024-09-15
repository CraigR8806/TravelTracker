

import Container from 'react-bootstrap/Container';

import React from 'react';
import Form from 'react-bootstrap/esm/Form';

import './Login.css';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { getUserClient, loadApiKey } from '../../data/api/ApiAccess';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { setLoggedInUser } from '../../data/services/UserService';
import App from '../../../App';



interface LoginCompProps {
    navigation:NavigateFunction,
    parentRef:App
}

interface LoginCompState {
    username:string,
    email:string,
    password:string,
    passwordVeri:string,
    passwordValid:boolean,
    usernameValid:boolean,
    emailValid:boolean,
    loginActive:boolean,
}

interface LoginProps {
    parentRef:App
}


function Login(props:LoginProps) {
    const navigation = useNavigate();

    return <LoginComp {...props} parentRef={props.parentRef} navigation={navigation} />;
}

class LoginComp extends React.Component<LoginCompProps, LoginCompState> {

    private navigate:NavigateFunction = this.props.navigation;
    private parentRef:App = this.props.parentRef;

    private navigateHome = () => {
        this.navigate("/");
    }

    private clearedState:LoginCompState = {
        username:'',
        email:'',
        password:'',
        passwordVeri:'',
        passwordValid:true,
        usernameValid:true,
        emailValid:true,
        loginActive:true
    }


    state:LoginCompState = this.clearedState;
    

    private login = (event:React.SyntheticEvent<unknown>): void => {
        this.validateForm(()=> {
            getUserClient().userLoginPost({
                "user":{
                    "username":this.state.username,
                    "password":this.state.password
                }
            }).then(data => {
                if(data) {
                    loadApiKey(data);
                    setLoggedInUser({
                        "username":this.state.username,
                        "activeApiKey":data.apiKey,
                        "apiKeyExpires":data.apiKeyExpiration,
                        "apiKeyRefreshExpiration":data.apiKeyRefreshExpiration
                    });
                    this.parentRef.setState({
                        "loggedIn":true, 
                        "user":{"username":this.state.username}
                        }, ()=> {
                            this.navigateHome();
                        }
                    );
                }
            }).catch(()=>{
                this.setState({
                    "usernameValid": false,
                    "passwordValid": false
                })
            });
        });
    }

    private createUser = (event:React.SyntheticEvent<unknown>): void => {
        this.validateForm(() => {
            getUserClient().upsertUser({
                "user":{
                    "username":this.state.username,
                    "password":this.state.password,
                    "email":this.state.email,
                }
            }).then((data)=>{
                if(data) {
                    this.makeLoginActive(()=>{
                        this.setState({"username":data.username});
                    });
                }
            }).catch(()=> {
                this.setState({
                    "usernameValid": false,
                    "passwordValid": false,
                    "emailValid":false
                })
            });
        });
    }

    private validateForm(action:()=>void) {
        let unValid = true;
        let eValid = true;
        let pValid = this.state.passwordValid;
        if(this.state.username === ''){
            unValid = false;
        }
        if(!this.state.loginActive && this.state.email === '') {
            eValid = false;
        }
        if(this.state.password === '') {
            pValid = false;
        }

        this.setState({
            "usernameValid":unValid,
            "emailValid":eValid,
            "passwordValid":pValid
        }, () => {
            if(this.state.usernameValid &&
                this.state.emailValid &&
                this.state.passwordValid) {
                action();
            }
        });
    }

    private handleTabSelect = (eventKey:string | null, event:React.SyntheticEvent<unknown>):void => {
        if(eventKey === "login"){
            this.makeLoginActive(null);
        } else if (eventKey === "create") {
            this.makeCreateActive(null);
        }
    }

    private makeLoginActive = (afterActive:(()=>void)|undefined|null):void => {
        if(!this.state.loginActive) {
            this.setState(this.clearedState);
            if(afterActive){
                afterActive();
            }
        }
        this.setState({"loginActive":true});
    }
    private makeCreateActive = (afterActive:(()=>void)|undefined|null):void => {
        if(this.state.loginActive) {
            this.setState(this.clearedState);
            if(afterActive){
                afterActive();
            }
        }
        this.setState({"loginActive":false});
    }

    private handleUsernameChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
        event.preventDefault();
        this.setState({"username":event.target.value});
    }
    private handleEmailChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
        event.preventDefault();
        this.setState({"email":event.target.value});
    }
    private handlePasswordChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
        event.preventDefault();
        this.setState({"password":event.target.value}, () => {
            if(!this.state.loginActive) {
                this.setState({passwordValid:this.state.password === this.state.passwordVeri})
            }
        });
    }
    private handlePasswordVeriChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
        event.preventDefault();
        this.setState({"passwordVeri":event.target.value}, ()=> {
            if(!this.state.loginActive){
                this.setState({passwordValid:this.state.password === this.state.passwordVeri})
            }
        });
    }

    render() {
        return (
        <Container>
            <div className="loginContainer">
                <div className="loginWindow">
                    <Tabs
                        defaultActiveKey="login"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                        onSelect={this.handleTabSelect}
                        >
                        <Tab active={this.state.loginActive} eventKey="login" title="Login">
                            <Form>
                                <Form.Group className="mb-3" controlId="formGroupUserName">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="username" onChange={this.handleUsernameChange} value={this.state.username} isInvalid={!this.state.usernameValid} placeholder="Enter User Name" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" onChange={this.handlePasswordChange} isInvalid={!this.state.passwordValid} placeholder="Password" />
                                </Form.Group>

                                <Button onClick={this.login} className="mb-3 loginButton">Login</Button>
                            </Form>
                        </Tab>
                        <Tab active={!this.state.loginActive} eventKey="create" title="Create Account">
                            <Form>
                                <Form.Group className="mb-3" controlId="formGroupUserName">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control type="username" onChange={this.handleUsernameChange} isInvalid={!this.state.usernameValid} placeholder="Enter User Name" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="username" onChange={this.handleEmailChange} isInvalid={!this.state.emailValid} placeholder="Enter Email Address" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPassword">
                                    <Form.Label>Enter Password</Form.Label>
                                    <Form.Control type="password" onChange={this.handlePasswordChange} isInvalid={!this.state.passwordValid} value={this.state.password} placeholder="Password" />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formGroupPasswordVeri">
                                    <Form.Label>Reenter Password</Form.Label>
                                    <Form.Control type="password" onChange={this.handlePasswordVeriChange} isInvalid={!this.state.passwordValid} value={this.state.passwordVeri} placeholder="Reenter Password" />
                                    <Form.Control.Feedback type="invalid">
                                        Password fields must match
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button onClick={this.createUser} className="mb-3 loginButton">Register</Button>
                            </Form>
                        </Tab>
                        
                    </Tabs>
                </div>
            </div>  
        </Container>
    );}
}

export default Login;