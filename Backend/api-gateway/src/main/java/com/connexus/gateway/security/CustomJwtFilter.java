package com.connexus.gateway.security;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RequiredArgsConstructor
@Component
public class CustomJwtFilter implements WebFilter {
	private final JwtUtils jwtUtils;
/*
 * filter method - Process the Web request and (optionally) delegate to the next WebFilter through the given WebFilterChain.
 */
	/*
	 *  ServerWebExchange 
	 *  - Contract for an HTTP request-response interaction. Provides access to the HTTP
 * request and response and also exposes additional server-side processing
 * related properties and features such as request attributes.
	 */
	@Override
	public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
		String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
		String requestId = exchange.getRequest().getId();
		log.info("in custom jwt filter   {} ",requestId);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        	
            return chain.filter(exchange); // Delegate the control to the next WebFilter in the chain 
        }
        String token = authHeader.substring(7);

        try {
        	log.info("jwt found  {}",token);
            Claims claims = jwtUtils.validateToken(token);

            String email = claims.getSubject();//can also be added 
            String role = claims.get("user_role", String.class);
            log.info("jwt role  {}",role);
            String userId=claims.get("user_id", String.class);
            log.info("jwt role  {}",userId);
            log.info("Claims : {}", claims.toString());
            //  Add custom headers for downstream services
            ServerHttpRequest mutatedRequest = exchange.getRequest()
                    .mutate()
                    .header("X-User-Id", userId)
                    .header("X-Role", role)
                    .build();
            log.info("added custom headers ");

            ServerWebExchange mutatedExchange =
                    exchange.mutate().request(mutatedRequest).build();

            List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority(role));
       //     UserPrincipal principal=new UserPrincipal(userId, email, null, authorities, null);

            Authentication auth =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);
            log.info("authentication {}",auth);
            return chain.filter(mutatedExchange)
                    .contextWrite(ReactiveSecurityContextHolder.withAuthentication(auth));

        } catch (Exception e) {
        	log.info("exc in filter {}",e);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().            		
            		setComplete();
        }

	}

}
