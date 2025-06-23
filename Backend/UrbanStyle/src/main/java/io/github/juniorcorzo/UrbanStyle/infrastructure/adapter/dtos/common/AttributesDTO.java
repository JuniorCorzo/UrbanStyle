package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AttributesDTO(
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String color,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String size,
        @Min(value = 1, message = "Quantity must be greater than 0", groups = {OnCreate.class, OnUpdate.class})
        int quantity
) {
}
