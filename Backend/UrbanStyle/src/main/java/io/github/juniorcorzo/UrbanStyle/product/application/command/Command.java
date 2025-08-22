package io.github.juniorcorzo.UrbanStyle.product.application.command;

import org.springframework.data.mongodb.core.BulkOperations;

@FunctionalInterface
public interface Command {
    BulkOperations execute(BulkOperations operation);
}
