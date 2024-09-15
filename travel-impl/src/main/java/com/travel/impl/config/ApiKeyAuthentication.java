package com.travel.impl.config;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import com.travel.impl.services.UserService;

public class ApiKeyAuthentication extends AbstractAuthenticationToken {
    private final String apiKey;

    private final UserService userService;

    public ApiKeyAuthentication(UserService userService, String apiKey, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.userService = userService;
        this.apiKey = apiKey;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        if(apiKey != null && !apiKey.isEmpty()) {
            return userService.getUserByApiKey(apiKey);
        }
        return null;
    }
}