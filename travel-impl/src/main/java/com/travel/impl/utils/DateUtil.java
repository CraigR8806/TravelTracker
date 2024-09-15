package com.travel.impl.utils;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;


public class DateUtil {
    
    public static final DateTimeFormatter DATE_TIME_FORMATTER = 
        DateTimeFormatter.ofPattern("yyy-MM-DD'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);

    public static Instant instantFromString(String datetime) {
        ZonedDateTime zdt = ZonedDateTime.parse(datetime, DATE_TIME_FORMATTER);
        return zdt.toInstant();
    }

    public static boolean dateTimeIsPast(String datetime) {
        return Instant.now().isAfter(instantFromString(datetime));
    }


}
