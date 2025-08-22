package io.github.juniorcorzo.UrbanStyle.application.service.bulks;

import io.github.juniorcorzo.UrbanStyle.application.commands.attributes.AttributeCommandFactory;
import io.github.juniorcorzo.UrbanStyle.application.commands.stock.StockCommandFactory;
import io.github.juniorcorzo.UrbanStyle.application.service.OrderService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OperationType;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.projections.ObtainStock;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.OrdersSaveDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.OrdersResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleProcessorService {
    private final ProductStockCommandOrchestrator productStockOrchestrator;
    private final StockCommandFactory stockCommandFactory;
    private final OrderService orderService;
    private final ProductsRepository productsRepository;

    @Transactional
    public ResponseDTO<OrdersResponseDTO> processSale(OrdersSaveDTO newOrder) {
        final OrdersResponseDTO orderSaved = this.orderService.createOrder(newOrder);

        this.prepareStockOrchestrator(orderSaved, OperationType.SALE);
        this.productStockOrchestrator.executeCommands();

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(orderSaved),
                "Sale process successfully"
        );
    }

    @Transactional
    public ResponseDTO<OrdersResponseDTO> processCancelOrder(String orderId) {
        final OrdersResponseDTO orderCanceled = this.orderService.cancelOrder(orderId);

        this.prepareStockOrchestrator(orderCanceled, OperationType.ORDER_CANCELLATION);
        this.productStockOrchestrator.executeCommands();

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(orderCanceled),
                "Sale process successfully"
        );
    }

    private void prepareStockOrchestrator(final OrdersResponseDTO orderSaved, final OperationType operationType) {
        orderSaved.products().forEach(product -> {
            int currentStock = this.productsRepository.findStockById(product.productId(), product.sku())
                    .map(ObtainStock::getStock)
                    .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT));

            if (currentStock < product.quantity()) throw new DocumentNotFound(DocumentsName.PRODUCT);
            int newStock = operationType == OperationType.SALE
                    ? currentStock - product.quantity()
                    : currentStock + product.quantity();

            this.updateProductStock(product, newStock);
            this.registerStockMovements(
                    product.productId(),
                    product.sku(),
                    orderSaved.id(),
                    operationType,
                    currentStock,
                    newStock
            );
        });
    }

    private void updateProductStock(final ProductSummary product, final int newStock) {
        this.productStockOrchestrator.addAttributeOperation(
                AttributeCommandFactory.createChangeStockCommand(
                        product.productId(),
                        product.sku(),
                        newStock
                )
        );

    }

    private void registerStockMovements(
            final String productId,
            final String sku,
            final String associate,
            final OperationType operationType,
            final int currentStock,
            final int newStock
    ) {
        this.productStockOrchestrator.addStockMovementCommand(
                this.stockCommandFactory.createStockMovementCommand(
                        productId,
                        sku,
                        associate,
                        operationType,
                        currentStock,
                        newStock
                )
        );
    }
}
