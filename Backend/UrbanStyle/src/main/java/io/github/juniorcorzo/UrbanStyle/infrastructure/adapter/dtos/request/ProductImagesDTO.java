package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ProductImagesDTO(
        @IdFormatConstraint
        @IdMustExists(entity = ProductEntity.class)
        String productId,
        @NotEmpty
        List<String> images
) {
}
