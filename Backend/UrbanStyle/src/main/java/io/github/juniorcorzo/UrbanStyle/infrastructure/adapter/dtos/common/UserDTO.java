package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public record UserDTO(
        @IdFormatConstraint(groups = OnUpdate.class)
        @IdMustExists(entity = UserEntity.class, groups = {OnUpdate.class})
        String id,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email must be valid", groups = {OnCreate.class, OnUpdate.class})
        String email,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(groups = {OnCreate.class})
        String password,
        String avatar,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        Roles role,
        @NotNull(groups = {OnCreate.class, OnUpdate.class})
        @Pattern(regexp = "^\\d{10}$", message = "Phone must be numeric", groups = {OnCreate.class, OnUpdate.class})
        String phone,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime createdAt,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        LocalDateTime updatedAt
) {

}
