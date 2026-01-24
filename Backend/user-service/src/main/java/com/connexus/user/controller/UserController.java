package com.connexus.user.controller;

import com.connexus.user.advices.ApiResponse;
import com.connexus.user.dto.SignupRequestDto;
import com.connexus.user.dto.UserDto;
import com.connexus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/hash-passwords")
    public ResponseEntity<ApiResponse<String>> hashPasswordsOfAllUsers() {
        return ResponseEntity.ok(new ApiResponse(userService.hashPasswordsOfAllUsers()));
    }
}
