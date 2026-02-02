package com.connexus.user.service;

import com.connexus.user.auth.UserContextHolder;
import com.connexus.user.dto.RecruiterDto;
import com.connexus.user.dto.UserDto;
import com.connexus.user.entity.User;
import com.connexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final UserService userService; // To get candidate details
    private final RecruiterService recruiterService; // To get recruiter details
    private final UserRepository userRepository; // Direct access if needed for internal logic

    public void sendRecruiterContactEmail(Long candidateUserId) {
        // 1. Get Current Recruiter (Logged in User)
        Long currentUserId = UserContextHolder.getCurrentUserId();
        UserDto currentUser = userService.getUserProfile(currentUserId);

        // Fetch Recruiter Company Details
        // We assume the current user IS a recruiter and has a record.
        RecruiterDto recruiterDetails = recruiterService.getRecruiterByUserId(currentUserId);

        // 2. Get Candidate Details
        UserDto candidate = userService.getUserProfile(candidateUserId);

        // 3. Compose Email
        String subject = "Hiring Opportunity at " + recruiterDetails.getCompanyName() + " via Connexus";
        String body = String.format(
                "Dear %s %s,\n\n" +
                        "I hope this message finds you well.\n\n" +
                        "I am %s %s, calling from %s, a leading company in the %s industry.\n" +
                        "We came across your profile on Connexus and were impressive by your skills and experience.\n\n"
                        +
                        "We are currently looking to hire talented individuals like you and would love to discuss potential opportunities.\n"
                        +
                        "Could you please share your updated resume and let us know a convenient time to connect?\n\n" +
                        "Looking forward to hearing from you.\n\n" +
                        "Best regards,\n" +
                        "%s %s\n" +
                        "%s | %s\n" +
                        "Connexus Platform",
                candidate.getFirstName(), candidate.getLastName(),
                currentUser.getFirstName(), currentUser.getLastName(), recruiterDetails.getCompanyName(),
                recruiterDetails.getIndustry(),
                currentUser.getFirstName(), currentUser.getLastName(),
                recruiterDetails.getCompanyName(), recruiterDetails.getIndustry());

        // 4. Send Email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(candidate.getEmail());
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("connexus.platform@gmail.com"); // Or configured default

        try {
            javaMailSender.send(message);
            log.info("Email sent successfully to {}", candidate.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}", candidate.getEmail(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
