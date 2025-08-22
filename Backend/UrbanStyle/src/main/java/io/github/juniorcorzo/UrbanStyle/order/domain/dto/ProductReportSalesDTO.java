package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

import io.github.juniorcorzo.UrbanStyle.category.domain.dto.CategorySummary;

import java.util.List;

public record ProductReportSalesDTO(
        String productId,
        String name,
        List<CategorySummary> categories,
        SalesInfoDTO total,
        SalesInfoDTO monthly
) {
}
