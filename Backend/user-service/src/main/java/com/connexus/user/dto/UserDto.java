package com.connexus.user.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String username;
    private String designation;
    private String profileImage;
}
