package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record AttributesItemsDTO(
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name,
        @Min(value = 0, message = "Quantity must be greater than or equal to zero", groups = {OnCreate.class, OnUpdate.class})
        @Max(value = 32000, message = "Quantity must be less than or equal to 32.000", groups = {OnCreate.class, OnUpdate.class})
        short quantity
) {
}
