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

    @GetMapping("/{recruiterId}")
    public ResponseEntity<RecruiterDto> getRecruiter(
            @PathVariable Long recruiterId
    ) {
        return ResponseEntity.ok(
                recruiterService.getRecruiterById(recruiterId)
        );
    }

    @GetMapping
    public ResponseEntity<List<RecruiterDto>> getAllRecruiters() {
        return ResponseEntity.ok(
                recruiterService.getAllRecruiters()
        );
    }

    @PutMapping("/{recruiterId}")
    public ResponseEntity<RecruiterDto> updateRecruiter(
            @PathVariable Long recruiterId,
            @RequestBody RecruiterDto dto
    ) {
        return ResponseEntity.ok(
                recruiterService.updateRecruiter(recruiterId, dto)
        );
    }

    @DeleteMapping("/{recruiterId}")
    public ResponseEntity<Void> deleteRecruiter(
            @PathVariable Long recruiterId
    ) {
        recruiterService.deleteRecruiter(recruiterId);
        return ResponseEntity.noContent().build();
    }
}

