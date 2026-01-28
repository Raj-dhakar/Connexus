package com.connexus.user.service;

import com.connexus.user.repository.UserRepository;
import com.connexus.user.entity.User;
import com.connexus.user.entity.UserRole;
import com.connexus.user.exception.ResourceAlreadyExistsException;
import com.connexus.user.exception.ResourceNotFoundException;
import com.connexus.user.entity.UserRole;
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

    public UserDto updateUser(Long userId, UserDto userDto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not exists with id : " + userId
                        )
                );
        
        if(userDto.getDesignation() != null) {
        	user.setDesignation(userDto.getDesignation());
        }
        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }

        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }

        if (userDto.getPhone() != null) {
            user.setPhone(userDto.getPhone());
        }

        if (userDto.getWebsite() != null) {
            user.setWebsite(userDto.getWebsite());
        }

        if (userDto.getDob() != null) {
            user.setDob(userDto.getDob());
        }

        if (userDto.getProfileImage() != null) {
            user.setProfileImage(userDto.getProfileImage());
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not exists with id : " + userId
            );
        }

        userRepository.deleteById(userId);
       
    }
    
    
    public UserDto getUserById() {
    	Long userId = 1L;
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not exists with id : " + userId
                        )
                );

        return modelMapper.map(user, UserDto.class);
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
