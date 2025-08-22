package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.product.application.command.attributes.AttributeCommand;
import io.github.juniorcorzo.UrbanStyle.product.application.command.attributes.AttributeCommandFactory;
import io.github.juniorcorzo.UrbanStyle.product.application.command.stock.StockCommandFactory;
import io.github.juniorcorzo.UrbanStyle.product.application.command.stock.StockMovementCommand;
import io.github.juniorcorzo.UrbanStyle.product.application.service.bulks.ProductStockCommandOrchestrator;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.Attribute;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.ProductsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductStockService {
    private final ProductsRepository productsRepository;
    private final ProductStockCommandOrchestrator productStockOrchestrator;
    private final StockCommandFactory stockCommandFactory;


    /**
     * Validates and updates the newStock movements for the attributes of a given product.
     * Depending on the current state of the newStock and the new changes, appropriate newStock movement records
     * are created, including handling new attributes, quantity adjustments, and removals.
     *
     * @param product The product entity containing updated attribute details to be checked and synchronized
     *                with existing newStock data.
     */
    @Transactional
    public void checkAttributesStock(final ProductEntity product) {
        final String userId = this.getUserIdBySecurityContext();
        final List<Attribute> currentAttributes = this.productsRepository
                .findAttributesById(product.getId())
                .getAttributes();

        final List<AttributeCommand> attributesCommand = AttributeCommandFactory
                .createAttributeCommand(product.getId(), currentAttributes, product.getAttributes());
        final List<StockMovementCommand> stockCommands = stockCommandFactory.createStockMovementCommand(
                product.getId(),
                userId,
                currentAttributes,
                product.getAttributes()
        );

        this.productStockOrchestrator.addAttributesOperations(attributesCommand);
        this.productStockOrchestrator.addStockMovementsCommands(stockCommands);

        this.productStockOrchestrator.executeCommands();
    }


    private String getUserIdBySecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
