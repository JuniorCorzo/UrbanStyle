package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserDTO(
        String id,
        String name,
        String email,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        String password,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String role,
        String phone
) {

}
