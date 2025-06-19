package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ShoppingCartDTO(
        @IdFormatConstraint
        @IdMustExists(entity = UserEntity.class)
        String userId,
        @Valid
        @NotNull
        @Size(min = 1, message = "Items must be provided")
        List<ProductSummary> items
) {
}
