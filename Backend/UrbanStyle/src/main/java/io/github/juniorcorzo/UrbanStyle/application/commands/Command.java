package io.github.juniorcorzo.UrbanStyle.application.commands;

import org.springframework.data.mongodb.core.BulkOperations;

@FunctionalInterface
public interface Command {
    BulkOperations execute(BulkOperations operation);
}
