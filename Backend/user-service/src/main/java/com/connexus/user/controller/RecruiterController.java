package com.connexus.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.connexus.user.dto.RecruiterDto;
import com.connexus.user.service.RecruiterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recruiters")
@RequiredArgsConstructor
public class RecruiterController {

        private final RecruiterService recruiterService;
        private final com.connexus.user.service.EmailService emailService;
        private final com.connexus.user.service.UserService userService;

        @GetMapping("/{recruiterId}")
        public ResponseEntity<RecruiterDto> getRecruiter(
                        @PathVariable Long recruiterId) {
                return ResponseEntity.ok(
                                recruiterService.getRecruiterById(recruiterId));
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<RecruiterDto> getRecruiterByUserId(
                        @PathVariable Long userId) {
                return ResponseEntity.ok(
                                recruiterService.getRecruiterByUserId(userId));
        }

        @GetMapping
        public ResponseEntity<List<RecruiterDto>> getAllRecruiters() {
                return ResponseEntity.ok(
                                recruiterService.getAllRecruiters());
        }

        @PostMapping("/{userId}/email")
        public ResponseEntity<com.connexus.user.advices.ApiResponse<String>> sendEmailToCandidate(
                        @PathVariable Long userId) {
                // userId here is the CANDIDATE's user ID
                emailService.sendRecruiterContactEmail(userId);
                return ResponseEntity.ok(new com.connexus.user.advices.ApiResponse<>("Email sent successfully"));
        }

        @PutMapping("/{recruiterId}")
        public ResponseEntity<RecruiterDto> updateRecruiter(
                        @PathVariable Long recruiterId,
                        @RequestBody RecruiterDto dto) {
                return ResponseEntity.ok(
                                recruiterService.updateRecruiter(recruiterId, dto));
        }

        @DeleteMapping("/{recruiterId}")
        public ResponseEntity<Void> deleteRecruiter(
                        @PathVariable Long recruiterId) {
                recruiterService.deleteRecruiter(recruiterId);
                return ResponseEntity.noContent().build();
        }
}
