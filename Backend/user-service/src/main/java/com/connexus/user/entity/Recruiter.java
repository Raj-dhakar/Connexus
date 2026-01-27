package com.connexus.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "recruiter_id"))
@Table(name = "recruiters")
public class Recruiter extends BaseEntity {

    private String companyName;

    private String companySize;

    private String industry;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
