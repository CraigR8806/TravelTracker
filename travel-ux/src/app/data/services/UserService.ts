import { User, UserFromJSON, UserToJSON } from "../generated";

import Cookies from 'universal-cookie';
import { apiKeyResponseFromUser } from "../utils/ApiKeyUtil";
import { clearApiKey, loadApiKey } from "../api/ApiAccess";
import { UserConsumerState, UserProvider } from "../providers/UserProvider/UserProvider";
const cookies = new Cookies();


let provider:UserProvider = new UserProvider();

export function registerAsUserConsumer(component:React.Component<any, UserConsumerState>, key?:string|undefined|null):string {
    return provider.register(component, key);
}

export function deregisterUserConsumer(key:string|undefined|null) {
    if(key){
        provider.deregister(key);
    }
}

export function retrieveUser():User {
    let user:User = UserFromJSON(cookies.get("loggedInUser"));
    if(user) {
        loadApiKey(apiKeyResponseFromUser(user));
    } else {
        clearApiKey();
        return {"username":""};
    }
    
    return user;
}

export function isLoggedIn():boolean {
    if(UserFromJSON(cookies.get("loggedInUser"))) {
        return true;
    }
    return false;
}

export function login(user:User):void {
    cookies.set("loggedInUser", UserToJSON(user), { path : '/'});
    loadApiKey(apiKeyResponseFromUser(user));
    provider.notify("user", user);
}

export function logout():void {
    cookies.remove("loggedInUser");
    clearApiKey();
    provider.notify("user",{"username":""});
}