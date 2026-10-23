package com.locatebase.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // use the CORS rules from CorsConfig (otherwise security blocks browser preflight requests)
                .cors(Customizer.withDefaults())

                // CSRF protection is for cookie sessions; our API uses tokens instead
                .csrf(csrf -> csrf.disable())

                // no server-side sessions: every request carries its own token
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // browsing is public: reading the guesthouse list and details needs no login
                        .requestMatchers(HttpMethod.GET, "/api/v1/guesthouses", "/api/v1/guesthouses/**").permitAll()
                        // everything else needs a valid login token
                        .anyRequest().authenticated())

                // read and verify the "Authorization: Bearer <token>" header using the Firebase settings above
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}


