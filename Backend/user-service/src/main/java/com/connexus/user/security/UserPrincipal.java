package com.connexus.user.security;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class UserPrincipal implements UserDetails {

	private final Long userId;
	private final String email;
	private final String password;
	private final Collection<? extends GrantedAuthority> authorities;
	private final String userRole;
	

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return this.authorities;
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return this.email;
	}

}
