package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BulkProductService {
    private final MongoTemplate mongoTemplate;
    private final ProductMapper productMapper;

    @Transactional
    public ProductDTO updateProduct(ProductEntity productEntity) {
        ProductEntity resultReplace = replaceProduct(productEntity);
        this.changeProductNameInOrders(resultReplace.getId(), productEntity.getName());

        return productMapper.toDTO(resultReplace);
    }

    private ProductEntity replaceProduct(ProductEntity productEntity) {
        BulkOperations bulkOperations = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, ProductEntity.class);
        final Query query = new Query(Criteria.where("id").is(productEntity.getId()));
        bulkOperations.replaceOne(query, productEntity);

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
