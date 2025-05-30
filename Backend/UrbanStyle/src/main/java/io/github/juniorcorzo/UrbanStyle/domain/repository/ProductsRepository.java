package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;
import java.util.Optional;

public interface ProductsRepository extends ListCrudRepository<ProductEntity, String> {

    @Aggregation(pipeline = {
            "{ '$unwind': '$categories' }",
            "{ '$group': { _id: '$categories.name', products: { $push: '$$ROOT' } } }",
            "{ '$project': { categories: '$_id', products: 1, _id: 0 } }"
    })
    Optional<List<ProductAggregationDomain>> groupAllByCategories();

    @Query("{ '$text': { '$search': '?0'} }")
    List<ProductEntity> searchProducts(String search);

    @Query(  value = "{ '_id': ?0 }", fields = "{ name: 1, _id: 0 }")
    String findNameById(String id);

    @Query("{ 'categories.name': ?0 }")
    Optional<List<ProductEntity>> findByCategory(String category);

    @Query("{ '_id': ?0 }")
    @Update("{ '$push': { 'images': { '$each': ?1} } }")
    void saveImagesToProduct(String id, List<String> images);

    @Query("{ '_id': ?0 }")
    @Update("{ '$pullAll': { 'images': ?1} }")
    void deleteImagesFromProduct(String id, List<String> images);
}
