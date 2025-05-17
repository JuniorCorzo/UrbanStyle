package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import java.time.LocalDate;

public record SalesDataDTO(
        String date,
        int sales,
        double total
) {
}