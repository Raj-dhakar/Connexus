package com.connexus.user.service;

import com.connexus.user.repository.UserRepository;
import com.connexus.user.entity.User;
import com.connexus.user.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import com.connexus.user.dto.UserDto;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserDto dto = modelMapper.map(user, UserDto.class);
                    dto.setRole(user.getUserRole().name());
                    dto.setUsername(user.getFirstName() + " " + user.getLastName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public UserDto getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDto dto = modelMapper.map(user, UserDto.class);
        dto.setRole(user.getUserRole().name());
        dto.setUsername(user.getFirstName() + " " + user.getLastName());
        return dto;
    }

    public String hashPasswordsOfAllUsers() {
        userRepository.findAll()
                .forEach(user -> {
                    user.setPassword(PasswordUtil.hashPassword(user.getPassword()));
                    userRepository.save(user);
                });
        return "All users password are hashed successfully !!!";
    }
}
