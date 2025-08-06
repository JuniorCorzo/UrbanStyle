package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import jakarta.validation.constraints.NotBlank;

public record UserAvatarDTO(
        @NotBlank
        @IdFormatConstraint
        @IdMustExists(entity = UserEntity.class)
        String userId,
        @NotBlank
        String avatar
) {
}
