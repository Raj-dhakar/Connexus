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
 * Can then create here ServerHttpSecurity Bean instance (equivalent to HttpSecurity) 
 * Enables reactive Spring Security 
 */
@EnableWebFluxSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	private final CustomJwtFilter customJwtFilter;

    @Bean
     SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http
            ) {

        return 
        		//Disable CSRF protection (stateless authentication)
        		http.csrf(ServerHttpSecurity.CsrfSpec::disable)
        		//Disable Basic Authentication
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)                
              //Disable formLogin 
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                //specfiy authorization rules (pathMatchers equivalent to  requestMatchers)
                .authorizeExchange(auth -> auth
                		.pathMatchers(HttpMethod.GET, "/users","/demo").permitAll()
                        .pathMatchers("/auth/users/signup","auth/recruiters/signup","/auth/users/login","auth/recruiters/login").permitAll() // UMS login/register
                        .pathMatchers( "/recruiters/**", "/users/**").hasRole("ADMIN")
                                .pathMatchers("/posts/**", "/likes/**", "/users/**").hasRole("USER")
        				 // authenticate any other remaining request
                        .anyExchange().authenticated()
                        )
                
               .addFilterAt(customJwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
