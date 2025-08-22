package io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.request;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
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
