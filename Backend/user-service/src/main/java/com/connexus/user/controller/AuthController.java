package com.connexus.user.controller;

import com.connexus.user.dto.*;
import com.connexus.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/users/signup")
    public ResponseEntity<UserDto> signUpUser(@RequestBody SignupRequestDto signupRequestDto) {
        UserDto userDto = authService.signUpUser(signupRequestDto);
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }

    @PostMapping("/recruiters/signup")
    public ResponseEntity<RecruiterDto> signUpRecruiter(
            @RequestBody RecruiterSignupRequestDto dto) {
        RecruiterDto recruiterDto = authService.signUpRecruiter(dto);
        return new ResponseEntity<>(recruiterDto, HttpStatus.CREATED);
    }

    @PostMapping("/users/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto) {
        String token = authService.login(loginRequestDto);
        return new ResponseEntity<>(LoginResponseDto.builder()
                .jwtToken(token).build(), HttpStatus.OK);
    }
}
