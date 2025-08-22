package io.github.juniorcorzo.UrbanStyle.product.domain.entities;

import io.github.juniorcorzo.UrbanStyle.product.domain.enums.OperationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document("stock_movements")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class StockMovementsEntity {
    @MongoId
    private ObjectId id;
    private String productId;
    private String sku;
    private OperationType operationType;
    // Performed by is only set for manual adjustments realized by the user
    private String performedBy;
    // Reference by is not set for manual adjustments but is set for other operations like new order insert
    private String referenceBy;
    private int quantityChange;
    private int previousStock;
    private int newStock;
    private LocalDateTime timestamp;
}
