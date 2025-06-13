package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;
import java.util.Optional;

public interface ProductsRepository extends MongoRepository<ProductEntity, String> {

    @Aggregation(pipeline = {
            "{ '$addFields': { 'allCategories': '$categories' } }",
            "{ '$unwind': '$categories' }",
            "{ '$group': { '_id': '$categories.name', 'products': { '$push': '$$ROOT' } } }",
            "{ '$project': { 'category': '$_id', 'products': { '$map': { 'input': '$products', 'as': 'p', 'in': { '$mergeObjects': [ '$$p', { 'categories': '$$p.allCategories' } ] } } }, '_id': 0 } }"
    })
    List<ProductAggregationDomain> groupAllByCategories();

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
