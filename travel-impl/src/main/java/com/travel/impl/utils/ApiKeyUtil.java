package com.travel.impl.utils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import com.travel.model.ApiKeyResponse;
import com.travel.model.User;

public class ApiKeyUtil {

    private static final long EXPIRY_TIME = 3600l;
    private static final long REFRESH_EXPIRY_TIME = 600l;
    
    public static ApiKeyResponse generateNewApiKeyContainer() {
        UUID apikey = UUID.randomUUID();

        Instant expiryTime = Instant.now().plus(EXPIRY_TIME, ChronoUnit.SECONDS);
        String expiryTimeString = DateUtil.DATE_TIME_FORMATTER.format(expiryTime);

        Instant refreshExpiryTime = expiryTime.plus(REFRESH_EXPIRY_TIME, ChronoUnit.SECONDS);
        String refreshExpiryTimeString = DateUtil.DATE_TIME_FORMATTER.format(refreshExpiryTime);

        return new ApiKeyResponse()
            .apiKey(apikey.toString())
            .apiKeyExpiration(expiryTimeString)
            .apiKeyRefreshExpiration(refreshExpiryTimeString);
    }

    public static boolean apiKeyIsValid(User user) {
        return user != null && user.getApiKeyRefreshExpiration() != null && !DateUtil.dateTimeIsPast(user.getApiKeyRefreshExpiration());
    }

}
