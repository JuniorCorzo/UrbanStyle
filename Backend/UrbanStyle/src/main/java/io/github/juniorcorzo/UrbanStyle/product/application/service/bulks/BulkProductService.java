package io.github.juniorcorzo.UrbanStyle.product.application.service.bulks;

import io.github.juniorcorzo.UrbanStyle.order.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.mappers.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class BulkProductService {
    private final MongoTemplate mongoTemplate;
    private final ProductMapper productMapper;

    @Transactional
    public ProductDTO updateProduct(ProductEntity productEntity) {
        long timeStart = Instant.now().toEpochMilli();
        try {
            log.info("Updating product {}", productEntity.getId());
            ProductEntity resultReplace = replaceProduct(productEntity);
            this.changeProductNameInOrders(resultReplace.getId(), productEntity.getName());

            log.info("Product {} updated in {} ms", productEntity.getId(), Instant.now().toEpochMilli() - timeStart);

            return productMapper.toDTO(resultReplace);
        } catch (Exception e) {
            log.error("Error updating product {}", productEntity.getId(), e);
            throw new RuntimeException(e);
        }
    }

    private ProductEntity replaceProduct(ProductEntity productEntity) {
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, ProductEntity.class);
        final Query query = new Query(Criteria.where("id").is(productEntity.getId()));
        final Update update = new Update()
                .set("name", productEntity.getName())
                .set("description", productEntity.getDescription())
                .set("price", productEntity.getPrice())
                .set("discount", productEntity.getDiscount())
                .set("categories", productEntity.getCategories())
                .set("attributes", productEntity.getAttributes())
                .set("newStock", productEntity.getStock());

        bulkOperations.updateOne(query, update);

        bulkOperations.execute();
        return mongoTemplate.findById(productEntity.getId(), ProductEntity.class);
    }

    private void changeProductNameInOrders(String productId, String newName) {
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, OrdersEntity.class);
        final Query query = new Query((Criteria.where("products.productId").is(productId)));
        final Update update = new Update().set("products.$.name", newName);

        bulkOperations.updateMulti(query, update);
        bulkOperations.execute();
    }
}
