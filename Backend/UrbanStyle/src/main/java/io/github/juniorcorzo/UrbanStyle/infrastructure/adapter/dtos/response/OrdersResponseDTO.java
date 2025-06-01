package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrdersResponseDTO(
        String id,
        String userId,
        List<ProductSummary> products,
        double total,
        OrderStatus status,
        AddressDTO address,
        PaymentMethod paymentMethod,
        LocalDateTime orderDate,
        List<OrderHistory> history
) {
}
