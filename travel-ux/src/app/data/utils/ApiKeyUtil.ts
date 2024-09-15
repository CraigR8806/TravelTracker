import { ApiKeyContainer } from "../api/ApiAccess";
import { ApiKeyResponse, User } from "../generated";
import { dateFromString } from "./DateUtil";




export function apiKeyContainerFromApiKeyResponse(apiKeyResponse:ApiKeyResponse) : ApiKeyContainer {
    return {
        "apiKey":apiKeyResponse.apiKey || '',
        "expiry":dateFromString(apiKeyResponse.apiKeyExpiration || ''),
        "refreshExpiry" : dateFromString(apiKeyResponse.apiKeyRefreshExpiration || '')
    }
}

export function apiKeyResponseFromUser(user:User) : ApiKeyResponse {
    return {
        "apiKey":user.activeApiKey,
        "apiKeyExpiration":user.apiKeyExpires,
        "apiKeyRefreshExpiration":user.apiKeyRefreshExpiration
    };
}