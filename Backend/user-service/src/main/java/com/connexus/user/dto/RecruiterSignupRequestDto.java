package com.connexus.user.dto;

import lombok.Data;

@Data
public class RecruiterSignupRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String companyName;
}
