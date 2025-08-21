package io.github.juniorcorzo.UrbanStyle.application.commands.attributes;

import io.github.juniorcorzo.UrbanStyle.domain.entities.Attribute;
import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Builder
public record UpdateAttributeCommand(
        Attribute updateAttribute,
        String productId,
        String sku
) implements AttributeCommand {
    private BulkOperations getBulkOperations(final BulkOperations operations) {
        final Query query = Query.query(
                Criteria.where("id")
                        .is(productId)
                        .and("attributes.sku")
                        .is(sku)
        );

        final Update update = Update
                .update("attributes.$[attr]", updateAttribute)
                .filterArray(Criteria.where("attr.sku").is(sku));

        return operations.updateOne(query, update);
    }

    @Override
    public BulkOperations execute(BulkOperations operation) {
        return this.getBulkOperations(operation);
    }
}
