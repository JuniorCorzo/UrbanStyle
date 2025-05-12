package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import java.time.LocalDate;

public record ReportSalesDTO(
        LocalDate date,
        int sales,
        double total
) {
}