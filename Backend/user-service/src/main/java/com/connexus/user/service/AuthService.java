package com.connexus.user.service;


import com.connexus.user.dto.LoginRequestDto;
import com.connexus.user.dto.SignupRequestDto;
import com.connexus.user.dto.UserDto;
import com.connexus.user.entity.User;
import com.connexus.user.entity.UserRole;
import com.connexus.user.exception.BadRequestException;
import com.connexus.user.exception.ResourceNotFoundException;
import com.connexus.user.repository.UserRepository;
import com.connexus.user.security.JwtService;
import com.connexus.user.security.UserPrincipal;
import com.connexus.user.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.handler.UserRoleAuthorizationInterceptor;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserDto signUp(SignupRequestDto signupRequestDto) {
        boolean exists = userRepository.existsByEmail(signupRequestDto.getEmail());
        if(exists) {
            throw new BadRequestException("User already exists, cannot signup again.");
        }

        User user = modelMapper.map(signupRequestDto, User.class);
        user.setPassword(PasswordUtil.hashPassword(signupRequestDto.getPassword()));
        user.setUserRole(UserRole.ROLE_USER);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    public String login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+loginRequestDto.getEmail()));

        boolean isPasswordMatch = PasswordUtil.checkPassword(loginRequestDto.getPassword(), user.getPassword());

        if(!isPasswordMatch) {
            throw new BadRequestException("Incorrect password");
        }

        Authentication holder=new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword());
        log.info("*****Before -  is authenticated {}",holder.isAuthenticated());//false
        Authentication fullyAuth = authenticationManager.authenticate(holder);
        //=> authentication success -> create JWT
        log.info("*****After -  is authenticated {}",fullyAuth.isAuthenticated());//true
        log.info("**** auth {} ",fullyAuth);//principal : user details , null : pwd , Collection<GrantedAuth>
        log.info("***** class of principal {}",fullyAuth.getPrincipal().getClass());//com.healthcare.security.UserPrincipal
        //downcast Object -> UserPrincipal
        UserPrincipal principal=(UserPrincipal) fullyAuth.getPrincipal();

        return jwtService.generateAccessToken(user);
    }


}
