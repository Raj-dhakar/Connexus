package com.connexus.user.controller;

import com.connexus.user.advices.ApiResponse;
import com.connexus.user.dto.SignupRequestDto;
import com.connexus.user.dto.UserDto;
import com.connexus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getCurrentUser(@PathVariable Long userId) {

        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PostMapping("/hash-passwords")
    public ResponseEntity<ApiResponse<String>> hashPasswordsOfAllUsers() {
        return ResponseEntity.ok(new ApiResponse(userService.hashPasswordsOfAllUsers()));
    }
}
