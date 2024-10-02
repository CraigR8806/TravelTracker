import { User } from "../../generated";
import { Provider } from "../Provider";

export interface UserConsumerState {
    "user":User,
    "userConsumerKey":string|undefined|null
}

export class UserProvider extends Provider<User> {
    
}

