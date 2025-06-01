package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.UserService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class UserController {
    private final UserService userService;

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
    public ResponseDTO<UserDTO> updateUser(@Validated(OnUpdate.class) @RequestBody UserDTO userDTO) {
        return userService.updateUser(userDTO);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<UserDTO> deleteUser(@IdFormatConstraint @PathVariable String id) {
        return userService.deleteUser(id);
    }

}
