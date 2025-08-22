package io.github.juniorcorzo.UrbanStyle.product.application.service.bulks;

import com.mongodb.bulk.BulkWriteResult;
import io.github.juniorcorzo.UrbanStyle.product.application.command.attributes.AttributeCommand;
import io.github.juniorcorzo.UrbanStyle.product.application.command.stock.StockMovementCommand;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.StockMovementsEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ProductStockCommandOrchestrator {
    private final MongoTemplate mongoTemplate;
    private final List<AttributeCommand> attributeCommands;
    private final List<StockMovementCommand> stockMovementCommands;

    public ProductStockCommandOrchestrator(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;

        attributeCommands = new ArrayList<>();
        stockMovementCommands = new ArrayList<>();
    }

    public void executeCommands() {
        if (attributeCommands.isEmpty()) {
            log.warn("No commands to execute");
            return;
        }

        if (stockMovementCommands.isEmpty()) {
            log.warn("No newStock movement commands to execute");
            return;
        }

        log.info("Executing {} commands", attributeCommands.size() + stockMovementCommands.size());
        this.executeAttributesCommand();
        this.executeStockMovementsCommand();
        log.info("Commands executed successfully");
    }

    public BulkWriteResult executeAttributesCommand() {
        BulkOperations attributeOperations = this.mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, ProductEntity.class);
        attributeCommands.forEach(attributeCommand -> attributeCommand.execute(attributeOperations));
        attributeCommands.clear();

        return attributeOperations.execute();
    }

    public BulkWriteResult executeStockMovementsCommand() {
        BulkOperations stockMovementOperations = this.mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, StockMovementsEntity.class);
        stockMovementCommands.forEach(stockMovementCommand -> stockMovementCommand.execute(stockMovementOperations));
        stockMovementCommands.clear();

        return stockMovementOperations.execute();
    }

    public void addAttributeOperation(AttributeCommand attributeCommand) {
        attributeCommands.add(attributeCommand);
    }

    public void addAttributesOperations(List<AttributeCommand> attributeCommand) {
        attributeCommands.addAll(attributeCommand);
    }

    public void addStockMovementCommand(StockMovementCommand stockCommand) {
        stockMovementCommands.add(stockCommand);
    }

    public void addStockMovementsCommands(List<StockMovementCommand> stockCommands) {
        stockMovementCommands.addAll(stockCommands);
    }
}
