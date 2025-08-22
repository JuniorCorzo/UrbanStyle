package io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.change_streams;

import com.mongodb.client.model.changestream.ChangeStreamDocument;
import com.mongodb.client.model.changestream.FullDocument;
import io.github.juniorcorzo.UrbanStyle.product.application.command.stock.StockCommandFactory;
import io.github.juniorcorzo.UrbanStyle.product.application.service.bulks.ProductStockCommandOrchestrator;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.messaging.ChangeStreamRequest;
import org.springframework.data.mongodb.core.messaging.MessageListener;
import org.springframework.data.mongodb.core.messaging.MessageListenerContainer;
import org.springframework.data.mongodb.core.messaging.Subscription;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class InsertProductListener {
    private final MessageListenerContainer messageListener;
    private final ProductStockCommandOrchestrator productStockOrchestrator;
    private final StockCommandFactory stockCommandFactory;

    public InsertProductListener(MessageListenerContainer messageListener, ProductStockCommandOrchestrator productStockOrchestrator, StockCommandFactory stockCommandFactory) {
        this.messageListener = messageListener;
        this.productStockOrchestrator = productStockOrchestrator;
        this.stockCommandFactory = stockCommandFactory;

        this.startListening();
    }

    public void startListening() {
        var listener = this.createListener();
        ChangeStreamRequest<ProductEntity> request = ChangeStreamRequest.builder(listener)
                .collection("products")
                .filter(Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("operationType").is("insert"))
                ))
                .fullDocumentLookup(FullDocument.UPDATE_LOOKUP)
                .publishTo(listener)
                .build();

        Subscription subscription = this.messageListener.register(request, ProductEntity.class);
        Runtime.getRuntime().addShutdownHook(new Thread(subscription::cancel));
    }

    private MessageListener<ChangeStreamDocument<Document>, ProductEntity> createListener() {
        return message -> {
            ProductEntity productEntity = message.getBody();

            assert productEntity != null;
            productEntity.getAttributes().forEach(attr -> {
                this.productStockOrchestrator.addStockMovementCommand(
                        stockCommandFactory.createUpsertStockCommand(
                                productEntity.getId(),
                                attr.getSku(),
                                null,
                                0,
                                attr.getQuantity()
                        )
                );
            });

            this.productStockOrchestrator.executeStockMovementsCommand();
        };
    }
}
