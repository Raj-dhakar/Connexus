package com.connexus.user.service;

import com.connexus.user.repository.UserRepository;
import com.connexus.user.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public String hashPasswordsOfAllUsers(){
        userRepository.findAll()
                .forEach(user -> {
                    user.setPassword(PasswordUtil.hashPassword(user.getPassword()));
                    userRepository.save(user);
                });
        return "All users password are hashed successfully !!!";
    }
}
