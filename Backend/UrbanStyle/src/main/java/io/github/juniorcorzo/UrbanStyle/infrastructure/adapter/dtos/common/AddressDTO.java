package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AddressDTO(
        @IdFormatConstraint(groups = OnUpdate.class)
        @IdMustExists(entity = AddressDTO.class, groups = OnUpdate.class)
        String id,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        @IdFormatConstraint(groups = {OnCreate.class, OnUpdate.class})
        @IdMustExists(entity = UserEntity.class, groups = {OnCreate.class, OnUpdate.class})
        String userId,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String street,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String city,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String state,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String country,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        @Pattern(regexp = "^\\d{6}$", message = "Postal code must be numeric", groups = {OnCreate.class, OnUpdate.class})
        @Size(min = 6, max = 6, message = "Postal code must be 6 characters", groups = {OnCreate.class, OnUpdate.class})
        String postalCode
) {
}
