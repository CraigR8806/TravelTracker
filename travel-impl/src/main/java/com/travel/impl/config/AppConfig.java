package com.travel.impl.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.travel.impl.filters.AuthenticationFilter;
import com.travel.impl.services.UserService;

@Configuration
@EnableWebSecurity
public class AppConfig {

    @Autowired
    private UserService userService;

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    
        http
            .cors(Customizer.withDefaults())
            .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(new AuthenticationFilter(userService), UsernamePasswordAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable());

        return http.build();
    }

    @Bean
    protected CORSFilter corsFilter() {
        CorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedMethod(HttpMethod.DELETE);
        config.addAllowedMethod(HttpMethod.GET);
        config.addAllowedMethod(HttpMethod.OPTIONS);
        config.addAllowedMethod(HttpMethod.PUT);
        config.addAllowedMethod(HttpMethod.POST);
        ((UrlBasedCorsConfigurationSource) source).registerCorsConfiguration("/**", config);
        return new CORSFilter(source);
    }

}
