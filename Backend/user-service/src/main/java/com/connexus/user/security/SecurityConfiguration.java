package com.connexus.user.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // To declare a java config class (equivalent to bean config xml file)
@EnableWebSecurity // to enable spring security
@EnableMethodSecurity // optional to add method level authorization rules
@Slf4j
public class SecurityConfiguration {

	

	/*
	 * Configure Spring sec filter chain as a spring bean (@Bean) , to override the
	 * spring sec defaults - Disable CSRF protection - Disable HttpSession - Disable
	 * login / logout page generation (i.e disable form login) - Disable Basic
	 * Authentication scheme. - Add authorization rules - swagger , sign in , sign
	 * up , listing doctors.. - public end points - any other request - authenticate
	 * Add HttpSecurity as the dependency - to build sec filter chain
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		log.info("********configuring spring sec filter chain*******");
		// disable CSRF protection
		http.csrf(csrf -> csrf.disable())
		// disable HttpSession creation
		.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		// add url based authentication n authorization rules
		.authorizeHttpRequests(request ->
				request.anyRequest().permitAll());				
		return http.build();
	}

	// Configure AuthManager as spring bean
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
