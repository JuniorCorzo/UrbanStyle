package io.github.juniorcorzo.UrbanStyle.domain.dtos;

public record SalesDataDTO(
        String date,
        int sales,
        double total
) {
}