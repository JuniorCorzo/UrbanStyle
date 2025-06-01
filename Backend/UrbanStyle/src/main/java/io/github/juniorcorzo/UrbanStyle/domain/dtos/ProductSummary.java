package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record ProductSummary(
        @NotBlank
        String productId,
        @NotBlank
        String name,
        @DecimalMin(value = "0.0", message = "Price must be greater than or equal to zero")
        double price,
        @Min(value = 0, message = "Quantity must be greater than or equal to zero")
        int quantity,
        @Min(value = 0, message = "Discount must be greater than or equal to zero")
        @Max(value = 100, message = "Discount must be less than or equal to 100")
        byte discount
) {
}
