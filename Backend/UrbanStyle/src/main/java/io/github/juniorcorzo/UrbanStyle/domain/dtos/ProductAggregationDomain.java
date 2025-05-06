package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;

import java.util.List;

public record ProductAggregationDomain(
        String categories,
        List<ProductDTO> products
) {
}
