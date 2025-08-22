package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.Images;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.Attribute;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.projections.ObtainAttributes;
import io.github.juniorcorzo.UrbanStyle.domain.projections.ObtainStock;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;
import java.util.Optional;

public interface ProductsRepository extends MongoRepository<ProductEntity, String> {

    @Query("{ '$text': { '$search': '?0'} }")
    List<ProductEntity> searchProducts(String search);

    @Query(value = "{ '_id': ?0 }", fields = "{ name: 1, _id: 0 }")
    String findNameById(String id);

    @Query("{ 'categories.name': ?0 }")
    Optional<List<ProductEntity>> findByCategory(String category);

    @Aggregation(pipeline = {
            "{ '$addFields': { 'quantity': { '$filter': { 'input': '$attributes', 'cond': { '$and': [ { '$eq': ['$$this.sku', ?1] }, { '$eq': ['$_id', ?0] } ] } } } } }",
            "{ '$unwind': '$quantity' }",
            "{ '$project': { '_id': 0, 'stock': '$quantity.quantity' } }"
    })
    Optional<ObtainStock> findStockById(String productId, String sku);

    @Query(value = "{ '_id': ?0 }", fields = "{ 'attributes': 1, '_id': 0 }")
    ObtainAttributes findAttributesById(String productId);

    @Query("{ '_id': ?0 }")
    @Update("{ '$push': { 'images': { '$each': ?1} } }")
    void saveImagesToProduct(String id, List<Images> images);

    @Query("{ '_id': ?#{[0].id} }")
    @Update("{" +
            "$set: { 'name': ?#{[0].name}, 'description': ?#{[0].description}, 'price': ?#{[0].price}, 'discount': ?#{[0].discount}, 'newStock': ?#{[0].newStock} }," +
            " $push: { 'categories': { '$each': ?#{[0].categories} } }" +
            "}")
    void updateProduct(ProductEntity product);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'attributes': ?1 } }")
    void updateAttributes(String productId, List<Attribute> attribute);

    @Query("{ '_id': ?0 }")
    @Update("{ '$pullAll': { 'images': ?1} }")
    void deleteImagesFromProduct(String id, List<Images> images);
}
