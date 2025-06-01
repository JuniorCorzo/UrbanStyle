package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import jakarta.validation.constraints.NotBlank;

public record AttributesDTO(
        @NotBlank
        String color,
        @NotBlank
        String size
) {
}
