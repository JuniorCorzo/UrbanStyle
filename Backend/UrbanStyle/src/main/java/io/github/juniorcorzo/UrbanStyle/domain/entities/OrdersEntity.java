package io.github.juniorcorzo.UrbanStyle.domain.entities;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.domain.enums.StatusEnums;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document("Orders")
public class OrdersEntity {
    @MongoId
    private String id;
    private String userId;
    private ProductSummary[] products;
    private double total;
    private StatusEnums status;
    private AddressEntity address;
    private PaymentMethod paymentMethod;
    private LocalDateTime orderDate;
    private OrderHistory history;
}
