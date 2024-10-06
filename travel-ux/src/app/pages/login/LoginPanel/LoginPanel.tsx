import { Button, TextField } from '@mui/material';
import { Component } from 'react';
import ErrorPanel from 'src/app/components/ErrorPanel/ErrorPanel';
import { getUserClient, loadApiKey } from 'src/app/data/api/ApiAccess';
import { User } from 'src/app/data/generated';
import { login } from 'src/app/data/services/UserService';


interface LoginPanelProps {
    onLogin:(user:User)=>void,
    autofillUsername?:string
}

interface LoginPanelState {
    requestInvalid:boolean,
    errorStr:string,
    username:string,
    password:string
}

class LoginPanel extends Component<LoginPanelProps, LoginPanelState> {

    constructor(props:LoginPanelProps) {
        super(props);
        this.state = {
            requestInvalid:false, 
            errorStr:"",
            username:props.autofillUsername || "",
            password:"",
        };
    }

    validateForm(action:()=>void) {
        if(this.state.username && this.state.username !== ""
            && this.state.password && this.state.password !== "") {
            this.setState({requestInvalid:false, errorStr:""}, action);
        } else {
            this.setState({requestInvalid:true, errorStr:"All fields are required"});
        }
    }

    loginClick() {
        this.validateForm(()=> {
            getUserClient().login({
                user:{
                    username:this.state.username,
                    password:this.state.password
                }
            }).then(data => {
                if(data) {
                    loadApiKey(data);
                    login({
                        username: this.state.username,
                        activeApiKey: data.apiKey,
                        apiKeyExpires: data.apiKeyExpiration,
                        apiKeyRefreshExpiration: data.apiKeyRefreshExpiration
                    });
                    this.props.onLogin({username:this.state.username});
                }
            }).catch(()=>{
                this.setState({requestInvalid:true, username:"", password:"", errorStr:"Invalid Account Credentials"});
            });
        });
    }

    render() {
        let username = this.state.username;
        let password = this.state.password;
        return (
            <>
                <TextField fullWidth value={username} onChange={(e)=>this.setState({username: e.target.value})} margin="normal" label="User Name" variant="standard" />
                <TextField fullWidth value={password} onChange={(e)=>this.setState({password: e.target.value})}margin="normal" label="Password" variant="standard" type="password" />
                <ErrorPanel show={this.state.requestInvalid} text={this.state.errorStr} />
                
                <Button sx={{marginTop:"10px"}} fullWidth onClick={()=>this.loginClick()} variant="contained">Login</Button>
            </>
        );
    }

}

export default LoginPanel;