package com.locatebase.api.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.time.Instant;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 401: no token, a fake token or an expired token
        AuthenticationEntryPoint unauthorized = (request, response, ex) ->
                writeError(response, 401, "Unauthorized",
                        "Login required: send a valid Firebase token in the Authorization header.",
                        request.getRequestURI());

        // 403: logged in, but the role is not allowed
        AccessDeniedHandler forbidden = (request, response, ex) ->
                writeError(response, 403, "Forbidden",
                        "You do not have permission to do this.",
                        request.getRequestURI());

        http
                // use the CORS rules from CorsConfig
                .cors(Customizer.withDefaults())

                // CSRF protection is for cookie sessions; our API uses tokens instead
                .csrf(csrf -> csrf.disable())

                // no server-side sessions: every request carries its own token
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // public: health check, browsing, ratings lists and filter lists (all GET only)
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/health",
                                "/api/v1/meta/**",
                                "/api/v1/guesthouses",
                                "/api/v1/guesthouses/**").permitAll()
                        // everything else needs a valid login token
                        .anyRequest().authenticated())

                .exceptionHandling(e -> e
                        .authenticationEntryPoint(unauthorized)
                        .accessDeniedHandler(forbidden))

                // read and verify the "Authorization: Bearer <token>" header using the Firebase settings
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(unauthorized)
                        .accessDeniedHandler(forbidden));

        return http.build();
    }

    // writes the same JSON error shape the rest of the API uses
    private static void writeError(HttpServletResponse response, int status, String error,
                                   String message, String path) throws IOException {
        String safePath = path.replace("\\", "\\\\").replace("\"", "\\\"");
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"timestamp\":\"" + Instant.now() + "\",\"status\":" + status
                + ",\"error\":\"" + error + "\",\"message\":\"" + message
                + "\",\"path\":\"" + safePath + "\",\"fieldErrors\":null}");
    }
}