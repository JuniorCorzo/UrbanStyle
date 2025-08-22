package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.product.domain.entities.StockMovementsEntity;
import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.product.domain.enums.OperationType;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.proyections.ObtainStock;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.StockMovementsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class StockMovementsService {
    private final StockMovementsRepository stockMovementsRepository;
    private final ProductsRepository productsRepository;

    public void insertRegisterStockMovement(String productId, String sku, OperationType operationType, String associateId, int differenceStock) {
        int actualStock = this.productsRepository.findStockById(productId, sku)
                .map(ObtainStock::getStock)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT,
                        String.format("%s-%s", productId, sku)));

        StockMovementsEntity stockMovement = StockMovementsEntity.builder()
                .productId(productId)
                .sku(sku)
                .operationType(operationType)
                .performedBy(operationType.getPerformedBy(associateId))
                .referenceBy(operationType.getReferenceBy(associateId))
                .quantityChange(differenceStock)
                .previousStock(actualStock - differenceStock)
                .newStock(operationType == OperationType.INITIAL_STOCK ? actualStock : differenceStock + actualStock)
                .timestamp(LocalDateTime.now())
                .build();
        this.stockMovementsRepository.save(stockMovement);
    }
}
