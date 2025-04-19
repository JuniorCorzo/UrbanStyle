package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface ProductsRepository extends ListCrudRepository<ProductEntity, String> {

    @Query("{ '$text': { '$search': '?0'} }")
    List<ProductEntity> searchProducts(String search);

    @Query("{ 'categories': ?0 }")
    List<ProductEntity> findByCategory(String category);

    @Query("{ '_id': ?0 }")
    @Update("{ '$push': { 'images': { '$each': ?1} } }")
    void saveImagesToProduct(String id, List<String> images);

    @Query("{ '_id': ?0 }")
    @Update("{ '$pullAll': { 'images': ?1} }")
    void deleteImagesFromProduct(String id, List<String> images);
}
