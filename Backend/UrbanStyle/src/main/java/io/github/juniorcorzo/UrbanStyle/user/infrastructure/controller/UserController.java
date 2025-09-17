package io.github.juniorcorzo.UrbanStyle.user.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.auth.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.user.application.service.UserService;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.request.UserAvatarDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class UserController {
    private final UserService userService;

    private final TokenService tokenService;

    @GetMapping
    public ResponseDTO<UserDTO> getUserById(@IdFormatConstraint @RequestParam("user-id") String id) {
        return userService.getUserById(id);
    }

    @GetMapping("/verify-password")
    public ResponseDTO<Boolean> validatePassword(@RequestParam("user-id") String userId, @RequestParam String password) {
        return this.userService.validatedPassword(userId, password);
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

    @PatchMapping("/change-password")
    public ResponseDTO<Object> changePassword(
            @RequestParam("user-id") String userId,
            @RequestParam("old-password") String oldPassword,
            @RequestParam("new-password") String newPassword
    ) {
        return this.userService.changePassword(userId, oldPassword, newPassword);
    }

    @PatchMapping("/change-avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> changeAvatar(@RequestBody UserAvatarDTO userAvatar) {
        return this.userService.changeAvatar(userAvatar.userId(), userAvatar.avatar());
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

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<UserDTO> deleteUser(@IdFormatConstraint @PathVariable String id) {
        return userService.deleteUser(id);
    }

    @DeleteMapping("/delete-avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Object> deleteAvatar(@RequestParam("user-id") @IdFormatConstraint String userId) {
        return this.userService.deleteAvatar(userId);
    }

    private void addSetCookieHeader(HttpServletResponse response, UserDTO userDTO) {

        String token = this.tokenService.generateToken(userDTO);
        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .maxAge(Duration.ofDays(30))
                .path("/")
                .build()
                .toString());
    }

}
