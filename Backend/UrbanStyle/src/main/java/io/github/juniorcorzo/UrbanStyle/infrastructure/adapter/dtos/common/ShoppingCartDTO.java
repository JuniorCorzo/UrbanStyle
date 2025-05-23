package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import java.util.List;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;

public record ShoppingCartDTO(
                String userId,
                List<ProductSummary> items) {
}
