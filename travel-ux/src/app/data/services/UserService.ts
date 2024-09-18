import { User, UserFromJSON, UserToJSON } from "../generated";

import Cookies from 'universal-cookie';
import { apiKeyResponseFromUser } from "../utils/ApiKeyUtil";
import { clearApiKey, loadApiKey } from "../api/ApiAccess";
const cookies = new Cookies();




export function isLoggedIn():boolean {
    if(UserFromJSON(cookies.get("loggedInUser"))) {
        return true;
    }
    return false;
}

export function getLoggedInUser():User{
    let user:User = UserFromJSON(cookies.get("loggedInUser"));
    if(user) {
        loadApiKey(apiKeyResponseFromUser(user));
    } else {
        clearApiKey();
        return {"username":""};
    }
    
    return user;
}

export function setLoggedInUser(user:User):void {
    cookies.set("loggedInUser", UserToJSON(user), { path : '/'});
    loadApiKey(apiKeyResponseFromUser(user));
}

export function logout():void {
    cookies.remove("loggedInUser");
    clearApiKey();
}