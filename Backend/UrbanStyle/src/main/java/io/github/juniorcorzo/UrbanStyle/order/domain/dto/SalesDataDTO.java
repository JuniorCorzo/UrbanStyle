package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

public record SalesDataDTO(
        String date,
        int sales,
        double total
) {
}