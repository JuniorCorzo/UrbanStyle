package io.github.juniorcorzo.UrbanStyle.application.service.bulks;

import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.CategoriesMapper;
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
public class BulkCategoryService {
    private final MongoTemplate mongoTemplate;
    private final CategoriesMapper mapper;

    @Transactional
    public CategoryDTO updateCategory(CategoryEntity categoryEntity) {
        long startTime = Instant.now().getEpochSecond();
        try {
            log.info("Bulk update: category(ID: {}) & product", categoryEntity.getId());
            var category = this.replaceCategory(categoryEntity);
            this.changeNameInProducts(category.id(), category.name());
            log.info("Category(ID: {}) and product updated in bulk in {} ms", categoryEntity.getId(), Instant.now().getEpochSecond() - startTime);
            return category;
        } catch (Exception e) {
            log.error("Error updating category(ID: {})",categoryEntity.getId(), e);
            throw new RuntimeException(e);
        }
    }

    private CategoryDTO replaceCategory(CategoryEntity category) {
        BulkOperations bulkOperations = this.mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, CategoryEntity.class);
        final Query query = new Query(Criteria.where("id").is(category.getId()));
        bulkOperations.replaceOne(query, category);
        bulkOperations.execute();
        return this.mapper.toDTO(mongoTemplate.findById(category.getId(), CategoryEntity.class));
    }

    private void changeNameInProducts(String categoryId, String categoryName){
        BulkOperations bulkOperations = this.mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, ProductEntity.class);

        final Query query = new Query((Criteria.where("categories.categoryId").is(categoryId)));
        final Update update = Update.update("categories.$.name", categoryName);
        bulkOperations.updateMulti(query, update);
        bulkOperations.execute();
    }
}
