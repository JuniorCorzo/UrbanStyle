package io.github.juniorcorzo.UrbanStyle.application.commands.stock;

import io.github.juniorcorzo.UrbanStyle.application.commands.Command;
import org.springframework.data.mongodb.core.BulkOperations;

@FunctionalInterface
public interface StockMovementCommand extends Command {

    /**
     * Executes the command using the provided BulkOperations instance.
     *
     * @param operation the BulkOperations instance to execute the command on
     * @return the BulkOperations instance after executing the command
     */
    BulkOperations execute(BulkOperations operation);
}
