import { ApiKeyResponse, Configuration, FetchParams, Middleware, ResponseContext, TravelApi, UsersApi } from "../generated";
import { apiKeyContainerFromApiKeyResponse } from "../utils/ApiKeyUtil";
import { dateTimeIsPast } from "../utils/DateUtil";

class ApiKeyRefreshCheck implements Middleware {

    public async pre(context: ResponseContext): Promise<FetchParams | void> {
        if(apiKeyContainer && 
            dateTimeIsPast(apiKeyContainer.expiry) && 
            !context.url.endsWith("refreshToken")) {

            if(!dateTimeIsPast(apiKeyContainer.refreshExpiry)) {
                await userClient.userRefreshTokenGet().then((data) => {
                    if(data) {
                        apiKeyContainer = apiKeyContainerFromApiKeyResponse(data);
                    }
                });
            
            } else {
                console.log("You're gonna need to log back in.  This will be expanded later");
            }
        } 
        return {
            url: context.url,
            init: {
                ...context.init,
                headers: new Headers({
                    ...context.init.headers,
                }),
            },
        };
    }
}

let middlewareArr:Middleware[] = [new ApiKeyRefreshCheck()];


const BASE_PATH:string | undefined = process.env.REACT_APP_API_BASE_PATH;
const defaultConfig:Configuration = new Configuration({"basePath":BASE_PATH, "middleware": middlewareArr});


let userClient:UsersApi = new UsersApi(defaultConfig);
let travelClient:TravelApi = new TravelApi(defaultConfig);

export interface ApiKeyContainer {
    apiKey:string,
    expiry:Date,
    refreshExpiry:Date
}

let apiKeyContainer:ApiKeyContainer | undefined = undefined;





export function getUserClient() {
    return userClient;
}

export function getTravelClient() {
    return travelClient;
}

export function loadApiKey(apiKeyResponse:ApiKeyResponse):void{
    apiKeyContainer = apiKeyContainerFromApiKeyResponse(apiKeyResponse)

    let newConfig:Configuration = new Configuration({...defaultConfig, "apiKey":apiKeyContainer.apiKey});
    userClient = new UsersApi(newConfig);
    travelClient = new TravelApi(newConfig);
}

export function clearApiKey():void {
    userClient = new UsersApi(defaultConfig);
    travelClient = new TravelApi(defaultConfig);
}