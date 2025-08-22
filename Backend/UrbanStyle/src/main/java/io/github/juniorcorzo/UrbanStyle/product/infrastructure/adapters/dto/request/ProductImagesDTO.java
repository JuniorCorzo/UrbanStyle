package io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.request;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ImagesDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ProductImagesDTO(
        @IdFormatConstraint
        @IdMustExists(entity = ProductEntity.class)
        String productId,
        @Valid
        @NotNull
        List<ImagesDTO> images
) {
}
