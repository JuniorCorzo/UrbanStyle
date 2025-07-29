package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import java.util.List;

public record ReportSalesDTO(
        List<SalesDataDTO> day,
        List<SalesDataDTO> month,
        double aov,
        double dailyTransactionsAverage,
        int transactions

) {
}
