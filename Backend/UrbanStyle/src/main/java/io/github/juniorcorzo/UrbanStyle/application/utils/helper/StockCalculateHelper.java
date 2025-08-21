package io.github.juniorcorzo.UrbanStyle.application.utils.helper;

import io.github.juniorcorzo.UrbanStyle.domain.enums.OperationType;
import lombok.Builder;

public class StockCalculateHelper {
    public static StockMovementData calculateMovement(
            OperationType operationType,
            int currentStock,
            int newStock
    ) {
        return switch (operationType) {
            case INITIAL_STOCK -> StockMovementData.builder()
                    .quantityChange(newStock)
                    .previousStock(0)
                    .newStock(newStock)
                    .build();

            case MANUAL_ADJUSTMENT -> StockMovementData.builder()
                    .quantityChange(newStock)
                    .previousStock(currentStock - newStock)
                    .newStock(currentStock)
                    .build();

            case DELETE_ATTRIBUTE -> StockMovementData.builder()
                    .quantityChange(-currentStock) // It's deleting stock so always negative
                    .previousStock(currentStock)
                    .newStock(0)
                    .build();

            case SALE -> StockMovementData.builder()
                    .quantityChange(-Math.abs(newStock)) // Always negative (sale)
                    .previousStock(currentStock + Math.abs(newStock))
                    .newStock(currentStock)
                    .build();

            case ORDER_CANCELLATION -> StockMovementData.builder()
                    .quantityChange(Math.abs(newStock)) // Always positive (order cancellation)
                    .previousStock(currentStock - Math.abs(newStock))
                    .newStock(currentStock)
                    .build();
        };
    }

    @Builder
    public record StockMovementData(int quantityChange, int previousStock, int newStock) {
    }
}


