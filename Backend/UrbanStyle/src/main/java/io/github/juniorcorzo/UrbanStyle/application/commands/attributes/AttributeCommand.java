package io.github.juniorcorzo.UrbanStyle.application.commands.attributes;

import org.springframework.data.mongodb.core.BulkOperations;

@FunctionalInterface
public interface AttributeCommand {
    BulkOperations execute(BulkOperations operation);
}
