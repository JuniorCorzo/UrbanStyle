package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.Images;
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
            "{ '$addFields': { 'originalDoc': '$$ROOT' } }",
            "{ '$unwind': '$categories' }",
            "{ '$group': { '_id': '$categories.name', 'products': { '$push': '$originalDoc' } } }",
            "{ '$project': { 'category': '$_id', 'products': 1, '_id': 0 } }"
    })

    List<ProductAggregationDomain> groupAllByCategories();

    @Query("{ '$text': { '$search': '?0'} }")
    List<ProductEntity> searchProducts(String search);

    @Query(value = "{ '_id': ?0 }", fields = "{ name: 1, _id: 0 }")
    String findNameById(String id);

    @Query("{ 'categories.name': ?0 }")
    Optional<List<ProductEntity>> findByCategory(String category);

    @Query("{ '_id': ?0 }")
    @Update("{ '$push': { 'images': { '$each': ?1} } }")
    void saveImagesToProduct(String id, List<Images> images);

    @Query("{ '_id': ?#{[0].id} }")
    @Update("{" +
            "$set: { 'name': ?#{[0].name}, 'description': ?#{[0].description}, 'price': ?#{[0].price}, 'discount': ?#{[0].discount}, 'stock': ?#{[0].stock} }," +
            " $push: { 'categories': { '$each': ?#{[0].categories} }, 'attributes': { '$each': ?#{[0].attributes} }" +
            "}")
    void updateProduct(ProductEntity product);

    @Query("{ '_id': ?0 }")
    @Update("{ '$pullAll': { 'images': ?1} }")
    void deleteImagesFromProduct(String id, List<Images> images);
}
