package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.TokenService;
import io.github.juniorcorzo.UrbanStyle.application.service.UserService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
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

    @GetMapping("/{id}")
    public ResponseDTO<UserDTO> getUserById(@IdFormatConstraint @PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping("/create")
    public ResponseDTO<UserDTO> createUser(@Validated(OnCreate.class) @RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<UserDTO> updateUser(@Validated(OnUpdate.class) @RequestBody UserDTO userDTO, @NotBlank @RequestParam("user-id") String userId) {
        return userService.updateUser(userDTO);
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
