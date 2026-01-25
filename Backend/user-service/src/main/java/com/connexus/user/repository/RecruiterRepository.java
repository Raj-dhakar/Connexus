package com.connexus.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.connexus.user.entity.Recruiter;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
}
