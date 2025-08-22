package io.github.juniorcorzo.UrbanStyle.product.application.command.attributes;

import io.github.juniorcorzo.UrbanStyle.product.domain.entities.Attribute;
import lombok.Builder;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

@Builder
public record InsertAttributeCommand(Attribute insertAttribute, String productId) implements AttributeCommand {
    private BulkOperations getBulkOperations(final BulkOperations operations) {
        final Query query = Query.query(Criteria.where("id").is(productId));
        final Update update = new Update().push("attributes", insertAttribute);

        return operations.updateOne(query, update);
    }

    @Override
    public BulkOperations execute(final BulkOperations operation) {
        return this.getBulkOperations(operation);
    }
}
