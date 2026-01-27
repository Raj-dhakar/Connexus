package com.connexus.gateway.security;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component //to declare a spring bean , for JWT validation
@Slf4j
public class JwtUtils {
	
	@Value("${jwt.secretKey}")
	private String jwtSecret;
	private SecretKey secretKey;
	
	@PostConstruct
	public void myInit()
	{
		log.info("****** creating secret key {} {} ",jwtSecret);
		secretKey=Keys.hmacShaKeyFor(jwtSecret.getBytes());		
	}
	public Claims validateToken(String jwt) {
		return Jwts.parser() //attach a parser
				.verifyWith(secretKey)
				.build() //builds JwtsParser
				.parseSignedClaims(jwt)
				.getPayload();
		
	}

}
