package io.github.juniorcorzo.UrbanStyle.user.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.auth.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.common.application.utils.CookiesUtils;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserAvatarService;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserDeletingService;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserPasswordService;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserService;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.request.UserAvatarDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class UserController {
    private final UserService userService;
    private final UserAvatarService userAvatarService;
    private final UserPasswordService userPasswordService;
    private final UserDeletingService userDeletingService;
    private final TokenService tokenService;

    @GetMapping
    public ResponseDTO<UserDTO> getUserById(@IdFormatConstraint @RequestParam("user-id") String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/verify-password")
    public ResponseDTO<Boolean> validatePassword(@RequestParam("user-id") String userId, @RequestParam String password) {
        boolean isValid = this.userPasswordService.validatedPassword(userId, password);
        return new ResponseDTO<>(HttpStatus.OK, List.of(isValid), "Password verifier");
    }

    @PostMapping("/create")
    public ResponseDTO<UserDTO> createUser(@Validated(OnCreate.class) @RequestBody UserDTO userDTO, HttpServletRequest request) {
        return userService.createUser(userDTO, request);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<UserDTO> updateUser(@Validated(OnUpdate.class) @RequestBody UserDTO userDTO, @NotBlank @RequestParam("user-id") String userId) {
        return userService.updateUser(userDTO);
    }

    @PatchMapping("/update-consent")
    @PreAuthorize("hasRole('USER')")
    ResponseDTO<UserDTO> updateUserConsent(@IdFormatConstraint @RequestParam("user-id") String userId, HttpServletRequest request) {
        return this.userService.updateUserConsent(userId, request);
    }

    @PatchMapping("/change-password")
    public ResponseDTO<Object> changePassword(
            @RequestParam("user-id") String userId,
            @RequestParam("old-password") String oldPassword,
            @RequestParam("new-password") String newPassword
    ) {
        this.userPasswordService.changePassword(userId, oldPassword, newPassword);
        return new ResponseDTO<>(HttpStatus.OK, "Password change successfully");
    }

    @PatchMapping("/change-avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> changeAvatar(@RequestBody UserAvatarDTO userAvatar) {
        this.userAvatarService.changeAvatar(userAvatar.userId(), userAvatar.avatar());
        return new ResponseDTO<>(HttpStatus.OK, "Avatar updated");
    }

    @PatchMapping("/assign-user-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<UserDTO> changeUserRole(@IdFormatConstraint @RequestParam("user-id") String userId, HttpServletResponse response) {
        ResponseDTO<UserDTO> userDTO = userService.changeUserRole(userId);
        this.addSetCookieHeader(response, userDTO.data().getFirst());
        return userDTO;
    }

    @PatchMapping("/assign-admin-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<UserDTO> changeAdminRole(@IdFormatConstraint @RequestParam("user-id") String userId, HttpServletResponse response) {
        ResponseDTO<UserDTO> userDTO = userService.changeAdminRole(userId);
        this.addSetCookieHeader(response, userDTO.data().getFirst());
        return userDTO;
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> deleteUser(
            @RequestParam("user-id")
            @IdFormatConstraint
            String id,
            @RequestParam("reason")
            @NotBlank
            String reason,
            HttpServletResponse response
    ) {
        CookiesUtils.clearCookie(response, "accessToken");
        return userDeletingService.deleteUser(id, reason);
    }


    @DeleteMapping("/delete-avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> deleteAvatar(@RequestParam("user-id") @IdFormatConstraint String userId) {
        this.userAvatarService.deleteAvatar(userId);
        return new ResponseDTO<>(HttpStatus.OK, "Avatar deleted");
    }

    private void addSetCookieHeader(HttpServletResponse response, UserDTO userDTO) {
        String token = this.tokenService.generateToken(userDTO);
        CookiesUtils.createCookie(response, "accessToken", token, 30);
    }

}
