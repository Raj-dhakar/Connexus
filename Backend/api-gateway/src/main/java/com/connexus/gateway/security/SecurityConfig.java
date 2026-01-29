package com.connexus.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import lombok.RequiredArgsConstructor;
//import static org.springframework.security.config.web.server.ServerHttpSecurity.

//Java configuration class
@Configuration
/*
 * Enables Spring Security WebFlux support to a Configuration class.
 * Can then create here ServerHttpSecurity Bean instance (equivalent to
 * HttpSecurity)
 * Enables reactive Spring Security
 */
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        private final CustomJwtFilter customJwtFilter;

        @Bean
        SecurityWebFilterChain securityWebFilterChain(
                        ServerHttpSecurity http) {

                return
                // Disable CSRF protection (stateless authentication)
                http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                                // Disable Basic Authentication
                                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                                // Disable formLogin
                                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                                // specfiy authorization rules (pathMatchers equivalent to requestMatchers)
                                .authorizeExchange(auth -> auth
                                                .pathMatchers(HttpMethod.GET, "/users/all", "/demo").permitAll()
                                                .pathMatchers("/auth/users/signup", "/auth/recruiters/signup",
                                                                "/auth/users/login",
                                                                "/auth/recruiters/login")
                                                .permitAll() // UMS login/register
                                                .pathMatchers("/recruiters/**").permitAll()
                                                .pathMatchers("/posts/**", "/likes/**", "/users/**").permitAll()
                                                .pathMatchers("/messages/**", "/ws/**").permitAll()
                                                // authenticate any other remaining request
                                                .anyExchange().permitAll())

                                .addFilterAt(customJwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                                .build();
        }

        @Bean
        public org.springframework.web.cors.reactive.CorsWebFilter corsWebFilter() {
                org.springframework.web.cors.CorsConfiguration corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.setAllowedOrigins(java.util.Collections.singletonList("http://localhost:3000"));
                corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);
                corsConfig.addAllowedMethod("*");
                corsConfig.addAllowedHeader("*");

                org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", corsConfig);

                return new org.springframework.web.cors.reactive.CorsWebFilter(source);
        }
}
