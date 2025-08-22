package io.github.juniorcorzo.UrbanStyle.address.infrastructure.adapter.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.address.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AddressDTO(
        @IdFormatConstraint(groups = OnUpdate.class)
        @IdMustExists(entity = AddressEntity.class, groups = OnUpdate.class)
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
