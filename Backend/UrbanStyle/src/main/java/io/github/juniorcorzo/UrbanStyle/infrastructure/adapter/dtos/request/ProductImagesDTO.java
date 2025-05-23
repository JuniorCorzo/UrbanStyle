package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ProductImagesDTO(
        @NotBlank
        @NotNull
        String productId,
        @NotEmpty
        @NotNull
        List<String> images
) { }
