package io.github.juniorcorzo.UrbanStyle.domain.dtos;

public record ProductSummary(
        String productId,
        String name,
        double price,
        int quantity,
        byte discount
) {
}
