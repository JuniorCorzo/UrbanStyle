package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

public record UserDTO(
        String id,
        String name,
        String email,
        String password,
        String role,
        String phone
) {

}
