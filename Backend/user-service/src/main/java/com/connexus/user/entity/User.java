package com.connexus.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Builder
@AllArgsConstructor
@Setter
@NoArgsConstructor
@AttributeOverride(name = "id", column = @Column(name = "user_id"))
@Table(name = "users")
public class User extends BaseEntity{

    @Column(name = "first_name", length = 30) // varchar(30)
    private String firstName;

    @Column(name = "last_name", length = 30)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role")
    private UserRole userRole;

    private String website;

    @Column(unique = true, length = 14)
    private String phone;

    private String designation;
    
    private String about;
    
    private String location;
    
    private Set<String> skills;

    private String profileImage;
    
    @Enumerated(EnumType.STRING)
    private ExperienceType expType;
    
    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Recruiter recruiter;
}
