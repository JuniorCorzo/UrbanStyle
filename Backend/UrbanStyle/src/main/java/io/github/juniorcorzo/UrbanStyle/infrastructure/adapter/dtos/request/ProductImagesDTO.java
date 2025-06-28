package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ImagesDTO;
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
