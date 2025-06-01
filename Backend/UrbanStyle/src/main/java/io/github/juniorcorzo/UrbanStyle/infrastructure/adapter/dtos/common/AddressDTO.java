package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
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
        @NotBlank
        @IdFormatConstraint()
        @IdMustExists(entity = UserEntity.class)
        String userId,
        @NotBlank
        String street,
        @NotBlank
        String city,
        @NotBlank
        String state,
        @NotBlank
        String country,
        @NotBlank
        @Pattern(regexp = "^\\d{6}$", message = "Postal code must be numeric")
        @Size(min = 6, max = 6, message = "Postal code must be 6 characters")
        String postalCode
) {
}
