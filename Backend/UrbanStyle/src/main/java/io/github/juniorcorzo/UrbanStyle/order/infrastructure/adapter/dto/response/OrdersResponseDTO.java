package io.github.juniorcorzo.UrbanStyle.order.infrastructure.adapter.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.address.infrastructure.adapter.dto.AddressDTO;

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
