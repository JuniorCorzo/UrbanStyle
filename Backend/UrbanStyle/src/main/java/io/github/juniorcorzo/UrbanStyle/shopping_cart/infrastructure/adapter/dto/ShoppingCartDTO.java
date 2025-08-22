package io.github.juniorcorzo.UrbanStyle.shopping_cart.infrastructure.adapter.dto;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
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
