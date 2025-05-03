package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrdersDTO(
        String id,
        String userId,
        List<ProductSummary> products,
        double total,
        OrderStatus status,
        AddressEntity address,
        PaymentMethod paymentMethod,
        LocalDateTime orderDate,
        List<OrderHistory> history
) {
}
