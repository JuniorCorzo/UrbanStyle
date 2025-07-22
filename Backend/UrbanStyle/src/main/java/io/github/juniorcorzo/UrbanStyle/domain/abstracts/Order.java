package io.github.juniorcorzo.UrbanStyle.domain.abstracts;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
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
