package io.github.juniorcorzo.UrbanStyle.user.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.enums.Roles;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.FieldExists;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.mapper.UserMapper;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.DataConsent;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserAvatarService userAvatarService;
    private final UserPasswordService userPasswordService;
    private final DataConsentService dataConsentService;

    public ResponseDTO<UserDTO> getUserById(String id) {
        UserEntity userResponse = this.userRepository.findById(id)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, id));
        return new ResponseDTO<>(HttpStatus.OK, List.of(userMapper.toDto(userResponse)), "User found");
    }

    public ResponseDTO<UserDTO> createUser(UserDTO userDTO, HttpServletRequest servletRequest) {
        try {
            final String avatarIdStorage = userAvatarService.sendAvatarToStorage(userDTO.avatar());

            final UserEntity userEntity = userMapper.toEntity(userDTO);
            final DataConsent dataConsent = this.dataConsentService.prepareDataConsent(userEntity.getDataConsent(), servletRequest);

            userEntity.setPassword(userPasswordService.encodePassword(userDTO.password()));
            userEntity.setAvatar(avatarIdStorage);
            userEntity.setDataConsent(dataConsent);

            UserEntity savedUser = this.userRepository.save(userEntity);
            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    List.of(userMapper.toDto(savedUser)),
                    "User created"
            );
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

            UserEntity updatedUser = this.userRepository
                    .findById(userDTO.id())
                    .orElseThrow(
                            () -> new DocumentNotFound(DocumentsName.USER, userDTO.id())
                    );

            return new ResponseDTO<>(
                    HttpStatus.OK,
                    List.of(userMapper.toDto(updatedUser)),
                    "User updated");
        } catch (DuplicateKeyException e) {
            log.error("Field already exists: Email: {}", userDTO.email());
            throw new FieldExists("Email", userDTO.email());
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
            throw new SaveDocumentFailed(DocumentsName.USER);
        }
    }

    public ResponseDTO<UserDTO> updateUserConsent(final String userId, final HttpServletRequest request) {
        final DataConsent dataConsent = this.dataConsentService.prepareDataConsent(
                DataConsent.builder()
                        .accepted(true)
                        .build(),
                request
        );

        this.userRepository.updateUserConsent(userId, dataConsent);
        final UserEntity userEntity = this.userRepository
                .findById(userId)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, userId));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(userMapper.toDto(userEntity)),
                "Terms accepted"
        );
    }

    public ResponseDTO<UserDTO> changeAdminRole(String id) {
        this.changeStatus(id, Roles.ROLE_ADMIN);
        return new ResponseDTO<>(HttpStatus.OK, this.getUserById(id).data(), "User role updated");
    }

    public ResponseDTO<UserDTO> changeUserRole(String id) {
        this.changeStatus(id, Roles.ROLE_USER);
        return new ResponseDTO<>(HttpStatus.OK, this.getUserById(id).data(), "User role updated");
    }

    private void changeStatus(String id, Roles role) {
        this.userRepository.changeRole(id, role);
    }
}
