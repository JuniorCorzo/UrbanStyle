package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

public record OrderReportDTO(
        int startedOrders,
        int canceledOrders,
        double cancellationRate
) {
}
