package io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos;

import io.github.juniorcorzo.UrbanStyle.product.domain.enums.OperationType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record StockMovementsDTO(
        String productId,
        String sku,
        OperationType operationType,
        String performedBy,
        String referenceBy,
        int quantityChange,
        int previousStock,
        int newStock,
        LocalDateTime timestamp
) {
}
