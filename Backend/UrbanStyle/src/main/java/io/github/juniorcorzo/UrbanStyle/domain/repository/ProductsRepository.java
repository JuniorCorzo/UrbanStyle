package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface ProductsRepository extends ListCrudRepository<ProductEntity, String> {
    @Query("{ 'categories': ?0 }")
    List<ProductEntity> findByCategory(String category);
}
