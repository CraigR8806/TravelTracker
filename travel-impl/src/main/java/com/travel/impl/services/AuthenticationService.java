package com.travel.impl.services;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Service;

import com.travel.impl.config.ApiKeyAuthentication;
import com.travel.impl.utils.DateUtil;
import com.travel.model.User;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuthenticationService {



    private static final String AUTH_TOKEN_HEADER_NAME = "api_key";

    public static Authentication getAuthentication(UserService userService, HttpServletRequest request) {
        String apiKey = request.getHeader(AUTH_TOKEN_HEADER_NAME);
        if(apiKey != null && !apiKey.isEmpty()) {
            User user = userService.getUserByApiKey(apiKey);
            if(user != null) {
                if(DateUtil.dateTimeIsPast(user.getApiKeyRefreshExpiration())) {
                    throw new BadCredentialsException("Provided Token has expired");
                }
            } else {
                throw new BadCredentialsException("Provided Token doesn't exist");
            }
        }

        return new ApiKeyAuthentication(userService, apiKey, AuthorityUtils.NO_AUTHORITIES);
    }

    
}
