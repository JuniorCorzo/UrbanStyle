package io.github.juniorcorzo.UrbanStyle.product.application.command.stock;

import io.github.juniorcorzo.UrbanStyle.product.application.utils.helper.StockCalculateHelper;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.StockMovementsEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.enums.OperationType;
import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;

import java.time.LocalDateTime;

@Builder
public record UpsertRegisterStockCommand(
        String productId,
        String sku,
        String associate,
        OperationType operationType,
        int currentStock,
        int newStock
) implements StockMovementCommand {
    private BulkOperations getStockCommand(BulkOperations operation) {
        StockCalculateHelper.StockMovementData stockData = StockCalculateHelper.calculateMovement(operationType, currentStock, newStock);

        StockMovementsEntity stockMovement =
                StockMovementsEntity.builder()
                        .productId(productId)
                        .sku(sku)
                        .operationType(operationType)
                        .performedBy(operationType.getPerformedBy(associate))
                        .referenceBy(operationType.getReferenceBy(associate))
                        .quantityChange(stockData.quantityChange())
                        .previousStock(stockData.previousStock())
                        .newStock(stockData.newStock())
                        .timestamp(LocalDateTime.now())
                        .build();

        operation.insert(stockMovement);
        return operation;
    }

    @Override
    public BulkOperations execute(BulkOperations operation) {
        return this.getStockCommand(operation);
    }

}
