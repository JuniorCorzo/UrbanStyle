package io.github.juniorcorzo.UrbanStyle.application.commands.stock;

import io.github.juniorcorzo.UrbanStyle.domain.entities.StockMovementsEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OperationType;
import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;

import java.time.LocalDateTime;


@Builder
public record DeleteRegisterStockCommand(
        String productId,
        String sku,
        String associate,
        int currentStock
) implements StockMovementCommand {
    private BulkOperations getStockCommand(BulkOperations operation) {
        OperationType operationType = OperationType.DELETE_ATTRIBUTE;
        StockMovementsEntity stockMovement =
                StockMovementsEntity.builder()
                        .productId(productId)
                        .sku(sku)
                        .operationType(operationType)
                        .performedBy(operationType.getPerformedBy(associate))
                        .referenceBy(operationType.getReferenceBy(associate))
                        .quantityChange(-currentStock)
                        .previousStock(currentStock)
                        .newStock(0)
                        .timestamp(LocalDateTime.now())
                        .build();


        return operation.insert(stockMovement);
    }

    @Override
    public BulkOperations execute(BulkOperations operation) {
        return this.getStockCommand(operation);
    }
}
