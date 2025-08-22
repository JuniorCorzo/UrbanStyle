package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

import java.util.List;

public record ReportSalesDTO(
        List<SalesDataDTO> day,
        List<SalesDataDTO> month,
        double aov,
        double dailyTransactionsAverage,
        int transactions

) {
}
