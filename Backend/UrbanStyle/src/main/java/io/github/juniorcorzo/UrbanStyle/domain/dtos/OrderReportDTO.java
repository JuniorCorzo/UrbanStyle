package io.github.juniorcorzo.UrbanStyle.domain.dtos;

public record OrderReportDTO(
        int startedOrders,
        int canceledOrders,
        double cancellationRate
) {
}
