package com.connexus.user.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.connexus.user.dto.RecruiterDto;
import com.connexus.user.entity.Recruiter;
import com.connexus.user.entity.User;
import com.connexus.user.exception.ResourceNotFoundException;
import com.connexus.user.repository.RecruiterRepository;
import com.connexus.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class RecruiterService {

        private final RecruiterRepository recruiterRepository;
        private final UserRepository userRepository;
        private final ModelMapper modelMapper;

        public RecruiterDto getRecruiterById(Long recruiterId) {
                Recruiter recruiter = recruiterRepository.findById(recruiterId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recruiter not found with id : " + recruiterId));

                return modelMapper.map(recruiter, RecruiterDto.class);
        }

        public RecruiterDto getRecruiterByUserId(Long userId) {
                Recruiter recruiter = recruiterRepository.findByUserId(userId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recruiter not found with user id : " + userId));
                return modelMapper.map(recruiter, RecruiterDto.class);
        }

        public List<RecruiterDto> getAllRecruiters() {
                return recruiterRepository.findAll()
                                .stream()
                                .map(r -> modelMapper.map(r, RecruiterDto.class))
                                .toList();
        }

        public RecruiterDto updateRecruiter(Long recruiterId, RecruiterDto dto) {

                Recruiter recruiter = recruiterRepository.findById(recruiterId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recruiter not found with id : " + recruiterId));

                recruiter.setCompanyName(dto.getCompanyName());
                recruiter.setCompanySize(dto.getCompanySize());
                recruiter.setIndustry(dto.getIndustry());

                return modelMapper.map(
                                recruiterRepository.save(recruiter),
                                RecruiterDto.class);
        }

        public void deleteRecruiter(Long recruiterId) {
                Recruiter recruiter = recruiterRepository.findById(recruiterId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Recruiter not found with id : " + recruiterId));
                log.info("Recuirters to be deleted {}" + recruiter);

                User user = recruiter.getUser();
                user.setRecruiter(null);
        }
}
