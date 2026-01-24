package com.connexus.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Data
public class LoginResponseDto {
    private String jwtToken;
}
