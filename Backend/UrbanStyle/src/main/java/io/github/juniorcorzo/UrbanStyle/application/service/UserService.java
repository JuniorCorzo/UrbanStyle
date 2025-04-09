package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.UserRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.UserMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseDTO<UserDTO> getUserByCredentials(String email) {
        UserEntity userResponse = this.userRepository.findUserByEmail(email);
        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userResponse)), "User found");
    }

    public ResponseDTO<UserDTO> getUserById(String id) {
        UserEntity userResponse = this.userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userResponse)), "User found");
    }

    public ResponseDTO<UserDTO> createUser(UserDTO userDTO) {
        UserEntity userEntity = userMapper.toEntity(userDTO);
        userEntity.setPassword(passwordEncoder.encode(userDTO.password()));

        UserEntity savedUser = this.userRepository.save(userEntity);

        return new ResponseDTO<>(HttpStatus.CREATED, List.of(userMapper.toDto(savedUser)), "User created");
    }

    public ResponseDTO<UserDTO> updateUser(UserDTO userDTO) {
        UserEntity userEntity = userMapper.toEntity(userDTO);
        UserEntity updatedUser = this.userRepository.save(userEntity);

        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(updatedUser)), "User updated");
    }

    public ResponseDTO<UserDTO> deleteUser(String id) {
        UserEntity userEntity = this.userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        this.userRepository.delete(userEntity);

        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userEntity)), "User deleted");
    }
}
