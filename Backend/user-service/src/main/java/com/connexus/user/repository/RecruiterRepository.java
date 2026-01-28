package com.connexus.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.connexus.user.entity.Recruiter;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
	
	Optional<Recruiter> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
