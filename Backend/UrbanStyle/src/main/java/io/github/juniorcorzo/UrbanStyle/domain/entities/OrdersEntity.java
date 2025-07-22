package io.github.juniorcorzo.UrbanStyle.domain.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.abstracts.Order;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;
import java.util.List;

@Document("orders")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrdersEntity extends Order {
    private String userId;
}
