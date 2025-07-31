package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import java.util.List;

public record ProductReportSalesDTO(
        String productId,
        String name,
        List<CategorySummary> categories,
        SalesInfoDTO total,
        SalesInfoDTO monthly
) {
}
