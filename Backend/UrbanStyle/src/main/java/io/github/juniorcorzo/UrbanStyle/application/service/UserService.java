package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.enums.Roles;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.FieldExists;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.repository.UserRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public ResponseDTO<UserDTO> getUserByCredentials(String email) {
        UserEntity userResponse = this.userRepository.findUserByEmail(email);
        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userResponse)), "User found");
    }

    public ResponseDTO<UserDTO> getUserById(String id) {
        UserEntity userResponse = this.userRepository.findById(id).orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, id));
        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userResponse)), "User found");
    }

    public ResponseDTO<UserDTO> createUser(UserDTO userDTO) {
        try {
            UserEntity userEntity = userMapper.toEntity(userDTO);
            userEntity.setPassword(passwordEncoder.encode(userDTO.password()));
            UserEntity savedUser = this.userRepository.save(userEntity);

            return new ResponseDTO<>(HttpStatus.CREATED, List.of(userMapper.toDto(savedUser)), "User created");
        } catch (DuplicateKeyException e) {
            log.error("Field already exists: Email - {}", userDTO.email());
            throw new FieldExists("Email", userDTO.email());
        } catch (RuntimeException e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            throw new SaveDocumentFailed(DocumentsName.USER);
        }
    }

    public ResponseDTO<UserDTO> updateUser(UserDTO userDTO) {
        try {
            UserEntity userEntity = userMapper.toEntity(userDTO);
            this.userRepository.updateUser(userEntity);

            UserEntity updatedUser = this.userRepository.findById(userDTO.id()).orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, userDTO.id()));
            return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(updatedUser)), "User updated");
        } catch (DuplicateKeyException e) {
            log.error("Field already exists: Email: {}", userDTO.email());
            throw new FieldExists("Email", userDTO.email());
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
            throw new SaveDocumentFailed(DocumentsName.USER);
        }
    }

    public ResponseDTO<UserDTO> changeAdminRole(String id) {
        this.changeStatus(id, Roles.ROLE_ADMIN);
        return new ResponseDTO<>(HttpStatus.OK, this.getUserById(id).data(), "User role updated");
    }

    public ResponseDTO<UserDTO> changeUserRole(String id) {
        this.changeStatus(id, Roles.ROLE_USER);
        return new ResponseDTO<>(HttpStatus.OK, this.getUserById(id).data(), "User role updated");
    }

    public ResponseDTO<UserDTO> deleteUser(String id) {
        try {
            UserEntity userEntity = this.userRepository.findById(id).orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, id));
            this.userRepository.delete(userEntity);

            return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userEntity)), "User deleted");
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            throw new DeleteDocumentFailed(DocumentsName.USER, id);
        }
    }

    private void changeStatus(String id, Roles role) {
        this.userRepository.changeRole(id, role);
    }

}
