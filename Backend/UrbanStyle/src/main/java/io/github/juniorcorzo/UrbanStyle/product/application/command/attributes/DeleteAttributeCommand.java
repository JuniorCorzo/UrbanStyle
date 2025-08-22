package io.github.juniorcorzo.UrbanStyle.product.application.command.attributes;

import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Builder
public record DeleteAttributeCommand(String productId, String sku) implements AttributeCommand {
    private BulkOperations getBulkOperations(final BulkOperations operations) {
        final Query query = Query.query(
                Criteria.where("id")
                        .is(productId)
        );

        final Update update = new Update()
                .pull(
                        "attributes",
                        Query.query(Criteria.where("sku").is(sku)
                        )
                );

        return operations.updateOne(query, update);
    }

    @Override
    public BulkOperations execute(BulkOperations operation) {
        return this.getBulkOperations(operation);
    }
}
