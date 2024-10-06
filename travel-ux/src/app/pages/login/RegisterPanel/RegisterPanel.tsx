import { Button, TextField } from '@mui/material';
import { Component } from 'react';
import ErrorPanel from 'src/app/components/ErrorPanel/ErrorPanel';
import { getUserClient } from 'src/app/data/api/ApiAccess';
import { User } from 'src/app/data/generated';


interface RegisterPanelProps {
    onRegister:(user:User)=>void
}

interface RegisterPanelState {
    username:string,
    email:string,
    password:string,
    passwordVeri:string,
    usernameValid:FieldIsValid,
    emailValid:FieldIsValid,
    passwordValid:FieldIsValid,
    passwordVeriValid:FieldIsValid,
}

interface FieldIsValid {
    isValid:boolean,
    errStr:string
}

class RegisterPanel extends Component<RegisterPanelProps, RegisterPanelState> {

    constructor(props:RegisterPanelProps) {
        super(props);

        this.state = {
            username:"",
            email:"",
            password:"",
            passwordVeri:"",
            usernameValid:{isValid:true, errStr:""},
            emailValid:{isValid:true, errStr:""},
            passwordValid:{isValid:true, errStr:""},
            passwordVeriValid:{isValid:true, errStr:""},
        }
    }

    validateForm(action:()=>void) {
        let usernameIsValid:FieldIsValid = {
            isValid: this.state.username !== "",
            errStr: this.state.username === ""?"User Name is Required":""
        }
        let emailIsValid:FieldIsValid = {
            isValid: this.state.email !== "",
            errStr: this.state.email === ""?"Email is Required":""
        }
        let passwordIsValid:FieldIsValid = {
            isValid: (this.state.password !== "" && this.state.password === this.state.passwordVeri),
            errStr: this.state.password === ""?"Password is Required": this.state.password !== this.state.passwordVeri?"Password Fields Must Match":""
        }
        let passwordVeriIsValid:FieldIsValid = {
            isValid: (this.state.passwordVeri !== "" && this.state.password === this.state.passwordVeri),
            errStr: this.state.passwordVeri === ""?"Password is Required": this.state.password !== this.state.passwordVeri?"Password Fields Must Match":""
        }

        let isValid = usernameIsValid.isValid && emailIsValid.isValid && passwordIsValid.isValid && passwordVeriIsValid.isValid;

        this.setState({
            usernameValid: usernameIsValid,
            emailValid: emailIsValid,
            passwordValid: passwordIsValid,
            passwordVeriValid: passwordVeriIsValid
        }, ()=>{
            if(isValid) {
                action();
            }
        });
    }

    registerClick() {
        this.validateForm(() => {
            getUserClient().upsertUser({
                user:{
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email,
                }
            }).then((data)=>{
                if(data) {
                    this.props.onRegister(data);
                }
            }).catch(()=> {
                this.setState({passwordVeriValid: {isValid:false, errStr: "Something went wrong with request"}});
            });
        });
    }

    render() {
        const {username, email, password, passwordVeri} = this.state;
        return (
            <>
                <TextField fullWidth value={username} onChange={(e)=>this.setState({username: e.target.value})} margin="normal" label="User Name" variant="standard" />
                <ErrorPanel show={!this.state.usernameValid.isValid} text={this.state.usernameValid.errStr} />

                <TextField fullWidth value={email} onChange={(e)=>this.setState({email: e.target.value})} margin="normal" label="Email" variant="standard" />
                <ErrorPanel show={!this.state.emailValid.isValid} text={this.state.emailValid.errStr} />

                <TextField fullWidth value={password} onChange={(e)=>this.setState({password: e.target.value})} margin="normal" label="Password" variant="standard" type="password" />
                <ErrorPanel show={!this.state.passwordValid.isValid} text={this.state.passwordValid.errStr} />

                <TextField fullWidth value={passwordVeri} onChange={(e)=>this.setState({passwordVeri: e.target.value})} margin="normal" label="Password" variant="standard" type="password" />
                <ErrorPanel show={!this.state.passwordVeriValid.isValid} text={this.state.passwordVeriValid.errStr} />
                
                <Button sx={{marginTop:"10px"}} fullWidth onClick={()=>this.registerClick()} variant="contained">Register</Button>
            </>
        );
    }
}

export default RegisterPanel;