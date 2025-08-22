package io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AttributesDTO(
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        String sku,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String color,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String size,
        @Min(
                value = 1,
                message = "Quantity must be greater than 0",
                groups = {OnCreate.class, OnUpdate.class})
        int quantity
) {
}
