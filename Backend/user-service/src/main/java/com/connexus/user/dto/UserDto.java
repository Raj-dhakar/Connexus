package com.connexus.user.dto;

import java.time.LocalDate;
import java.util.Set;

import com.connexus.user.entity.ExperienceType;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String email;
    private String role;
    private String website;
    private String phone;
    private String username;
    private String designation;
    private String profileImage;
    private String about;
    private String location;
    private Set<String> skills;
    private ExperienceType expType;
}
