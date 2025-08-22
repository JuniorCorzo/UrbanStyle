package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

public record CategoryReportSalesDTO(
        String categoryId,
        String name,
        SalesInfoDTO total,
        SalesInfoDTO monthly
) {
}
