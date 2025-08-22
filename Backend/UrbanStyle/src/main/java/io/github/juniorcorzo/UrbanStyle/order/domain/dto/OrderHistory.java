package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

import io.github.juniorcorzo.UrbanStyle.order.domain.enums.OrderStatus;

import java.time.LocalDateTime;

public record OrderHistory(
        OrderStatus status,
        LocalDateTime date
) {
}
