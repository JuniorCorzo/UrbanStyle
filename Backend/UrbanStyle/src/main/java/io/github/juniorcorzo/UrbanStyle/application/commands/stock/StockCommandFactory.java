package io.github.juniorcorzo.UrbanStyle.application.commands.stock;

import io.github.juniorcorzo.UrbanStyle.application.service.aggregations.ProductAggregationService;
import io.github.juniorcorzo.UrbanStyle.application.utils.AttributesManageUtils;
import io.github.juniorcorzo.UrbanStyle.domain.entities.Attribute;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OperationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

@Component
@RequiredArgsConstructor
public class StockCommandFactory {
    private final ProductAggregationService productsAggregation;

    public List<StockMovementCommand> createStockCommand(
            final String productId,
            final String associate,
            final List<Attribute> currentAttributes,
            final List<Attribute> attributesToUpdate
    ) {
        final Map<String, Attribute> actualAttributesMap = AttributesManageUtils.toMapBySku(currentAttributes);
        final Map<String, Attribute> updateAttributesMap = AttributesManageUtils.toMapBySku(attributesToUpdate);

        final List<StockMovementCommand> stockCommands = new ArrayList<>(updateAttributesMap.entrySet()
                .parallelStream()
                .map((attributeEntry) -> createUpsertStockCommand(
                                productId,
                                attributeEntry.getValue().getSku(),
                                associate,
                                actualAttributesMap.get(attributeEntry.getKey()) != null ? actualAttributesMap.get(attributeEntry.getKey()).getQuantity() : 0,
                                attributeEntry.getValue().getQuantity()
                        )
                ).toList());

        stockCommands.addAll(
                actualAttributesMap.entrySet()
                        .parallelStream()
                        .filter(Predicate.not(actualAttribute -> updateAttributesMap.containsKey(actualAttribute.getKey())))
                        .map(actualAttribute -> createDeleteStockCommand(
                                productId,
                                actualAttribute.getValue().getSku(),
                                associate,
                                actualAttribute.getValue().getQuantity())
                        ).toList()
        );

        return stockCommands;
    }

    public StockMovementCommand createUpsertStockCommand(
            String productId,
            String sku,
            String associate,
            int currentStock,
            int newStock
    ) {
        boolean existSku = this.productsAggregation.existsByIdAndSku(productId, sku);
        return UpsertRegisterStockCommand.builder()
                .productId(productId)
                .sku(sku)
                .associate(associate)
                .operationType(existSku ? OperationType.MANUAL_ADJUSTMENT : OperationType.INITIAL_STOCK)
                .currentStock(currentStock)
                .newStock(newStock)
                .build();
    }

    public StockMovementCommand createDeleteStockCommand(String productId, String sku, String associate, int currentStock) {
        return DeleteRegisterStockCommand.builder()
                .productId(productId)
                .sku(sku)
                .associate(associate)
                .currentStock(currentStock)
                .build();
    }
}
