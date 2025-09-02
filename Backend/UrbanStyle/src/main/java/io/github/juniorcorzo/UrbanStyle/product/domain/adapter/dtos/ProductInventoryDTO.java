package io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos;

import lombok.Builder;

import java.util.List;

@Builder
public record ProductInventoryDTO(
        String productId,
        String sku,
        String product,
        List<StockMovementsDTO> movements
) {
}
