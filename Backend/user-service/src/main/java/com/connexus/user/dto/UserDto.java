package com.connexus.user.dto;

import java.time.LocalDate;

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
}
