package io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import jakarta.validation.constraints.NotBlank;

public record ImagesDTO(
        @NotBlank(groups = OnCreate.class)
        String color,
        @NotBlank(groups = OnCreate.class)
        String image
) {
}
