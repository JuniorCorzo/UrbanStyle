package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;

import java.time.LocalDateTime;

public record OrderHistory(
        OrderStatus status,
        LocalDateTime date
) {
}
