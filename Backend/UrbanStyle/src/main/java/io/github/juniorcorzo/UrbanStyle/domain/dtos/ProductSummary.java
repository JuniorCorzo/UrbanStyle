package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record ProductSummary(
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String productId,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String sku,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String color,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String size,
        @DecimalMin(value = "0.0", message = "Price must be greater than or equal to zero", groups = {OnCreate.class, OnUpdate.class})
        double price,
        @Min(value = 0, message = "Quantity must be greater than or equal to zero", groups = {OnCreate.class, OnUpdate.class})
        int quantity,
        @Min(value = 0, message = "Discount must be greater than or equal to zero", groups = {OnCreate.class, OnUpdate.class})
        @Max(value = 100, message = "Discount must be less than or equal to 100", groups = {OnCreate.class, OnUpdate.class})
        byte discount
) {
}
