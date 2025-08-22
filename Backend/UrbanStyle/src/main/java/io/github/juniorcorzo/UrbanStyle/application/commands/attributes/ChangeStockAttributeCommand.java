package io.github.juniorcorzo.UrbanStyle.application.commands.attributes;

import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Builder
public record ChangeStockAttributeCommand(String productId, String sku, int newStock) implements AttributeCommand {
    private BulkOperations getBulkOperations(BulkOperations operations) {
        Query query = Query.query(Criteria.where("_id").is(productId));
        Update update = new Update().set("attributes.$[attr].quantity", newStock)
                .filterArray(Criteria.where("attr.sku").is(sku));

        return operations.updateOne(query, update);
    }

    @Override
    public BulkOperations execute(BulkOperations operation) {
        return this.getBulkOperations(operation);
    }
}
