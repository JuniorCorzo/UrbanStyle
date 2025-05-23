package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import lombok.Builder;

@Builder
public record ProductSummary(
        String productId,
        String name,
        double price,
        int quantity,
        byte discount
) {
}
