package com.connexus.user.service;

import com.connexus.user.dto.*;
import com.connexus.user.entity.Recruiter;
import com.connexus.user.entity.User;
import com.connexus.user.entity.UserRole;
import com.connexus.user.exception.BadRequestException;
import com.connexus.user.exception.ResourceNotFoundException;
import com.connexus.user.repository.RecruiterRepository;
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
import java.util.concurrent.RecursiveAction;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RecruiterRepository recruiterRepository;

    public RecruiterDto signUpRecruiter(RecruiterSignupRequestDto dto) {
        boolean exists = userRepository.existsByEmail(dto.getEmail());
        if (exists) {
            throw new BadRequestException("User already exists, cannot signup again.");
        }

        User user = modelMapper.map(dto, User.class);
        user.setPassword(PasswordUtil.hashPassword(dto.getPassword()));
        user.setUserRole(UserRole.ROLE_RECRUITER);
        User savedUser = userRepository.save(user);

        // Create Recruiter Profile
        Recruiter recruiter = new Recruiter();
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setUser(savedUser);
        recruiterRepository.save(recruiter);

        return modelMapper.map(savedUser, RecruiterDto.class);
    }

    public UserDto signUpUser(SignupRequestDto signupRequestDto) {
        boolean exists = userRepository.existsByEmail(signupRequestDto.getEmail());
        if (exists) {
            throw new BadRequestException("User already exists, cannot signup again.");
        }

        User user = modelMapper.map(signupRequestDto, User.class);
        user.setPassword(PasswordUtil.hashPassword(signupRequestDto.getPassword()));
        user.setUserRole(UserRole.ROLE_USER);
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDto.class);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with email: " + loginRequestDto.getEmail()));

        boolean isPasswordMatch = PasswordUtil.checkPassword(loginRequestDto.getPassword(), user.getPassword());

        if (!isPasswordMatch) {
            throw new BadRequestException("Incorrect password");
        }

        Authentication holder = new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(),
                loginRequestDto.getPassword());
        log.info("*****Before -  is authenticated {}", holder.isAuthenticated());// false
        Authentication fullyAuth = authenticationManager.authenticate(holder);
        // => authentication success -> create JWT
        log.info("*****After -  is authenticated {}", fullyAuth.isAuthenticated());// true
        log.info("**** auth {} ", fullyAuth);// principal : user details , null : pwd , Collection<GrantedAuth>
        log.info("***** class of principal {}", fullyAuth.getPrincipal().getClass());// com.healthcare.security.UserPrincipal
        // downcast Object -> UserPrincipal
        UserPrincipal principal = (UserPrincipal) fullyAuth.getPrincipal();

        String token = jwtService.generateAccessToken(user);

        return LoginResponseDto.builder()
                .jwtToken(token)
                .build();
    }

}
