package io.github.juniorcorzo.UrbanStyle.domain.dtos;

public record CategoryReportSalesDTO(
        String categoryId,
        String name,
        SalesInfoDTO total,
        SalesInfoDTO monthly
) {
}
