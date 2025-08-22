package io.github.juniorcorzo.UrbanStyle.order.domain.abstracts;

import io.github.juniorcorzo.UrbanStyle.order.domain.dto.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.address.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class Order {
    @MongoId
    protected String id;
    protected List<ProductSummary> products;
    protected double total;
    protected OrderStatus status;
    protected AddressEntity address;
    protected PaymentMethod paymentMethod;
    protected LocalDateTime orderDate;
    protected List<OrderHistory> history;
}
