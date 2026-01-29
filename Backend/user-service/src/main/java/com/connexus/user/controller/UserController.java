package com.connexus.user.controller;

import com.connexus.user.advices.ApiResponse;
import com.connexus.user.dto.SignupRequestDto;
import com.connexus.user.dto.UserDto;
import com.connexus.user.service.CloudinaryService;
import com.connexus.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getCurrentUser(@PathVariable Long userId) {

        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @GetMapping("/self")
    public ResponseEntity<UserDto> getUserById() {

        return ResponseEntity.ok(userService.getUserById());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(
                userService.updateUser(userId, userDto));
    }

    @PostMapping("/hash-passwords")
    public ResponseEntity<ApiResponse<String>> hashPasswordsOfAllUsers() {
        return ResponseEntity.ok(new ApiResponse(userService.hashPasswordsOfAllUsers()));
    }

    @PostMapping("/self/profile-image")
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(
            @RequestParam MultipartFile file) {

        String imageUrl = cloudinaryService.uploadFile(file, "users");

        userService.updateProfileImage(imageUrl);
        return ResponseEntity.ok(new ApiResponse(imageUrl));
    }

    @GetMapping("/{userId}/profile-image")
    public ResponseEntity<ApiResponse<String>> getProfileImage(@PathVariable Long userId) {
        String imageUrl = userService.getProfileImage(userId);
        return ResponseEntity.ok(new ApiResponse(imageUrl));
    }

}
