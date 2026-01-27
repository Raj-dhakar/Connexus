package com.connexus.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PersonDto {

    private Long userId;
    private String name;
    private String role;
}
