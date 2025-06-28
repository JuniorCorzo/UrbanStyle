package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import jakarta.validation.constraints.NotBlank;

public record ImagesDTO(
        @NotBlank(groups = OnCreate.class)
        String color,
        @NotBlank(groups = OnCreate.class)
        String image
) {
}
