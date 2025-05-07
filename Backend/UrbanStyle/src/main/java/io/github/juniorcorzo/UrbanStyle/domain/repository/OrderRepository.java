package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends ListCrudRepository<OrdersEntity, String> {
    @Query("{ 'userId': ?0 }")
    List<OrdersEntity> findAllOrdersByUserId(String userId);

    @Aggregation(pipeline = {
            "{ '$unwind': '$products' }",
            "{ '$group': { _id: '$products.name', 'sold': { $sum: '$products.quantity' } } }",
            "{ '$project': { '_id': 0, 'sold': 1, name: '$_id' } }",
            "{ '$sort': { sold: -1 } }",
            "{ $limit: 10 }"
    })
    List<SalesRecord> findProductsMoreSold();

    @Aggregation(
            pipeline = {
                    "{ $unwind: '$products' }",
                    "{ $lookup: { from: 'products', localField: 'products.productId', foreignField: '_id', as: 'product_info' } }",
                    "{ $unwind: { path: '$product_info' } }",
                    "{ $unwind: { path: '$product_info.categories' } }",
                    "{ $group: { _id:  '$product_info.categories', sold: { $sum: 1 } } }",
                    "{ $project: { _id: 0, name: '$_id', sold: 1 } }",
                    "{ $sort: { sold: -1 } }",
                    "{ $limit: 10 }"
            }
    )
    List<SalesRecord> findCategoriesMoreSold();

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'status': ?1}, '$push': { 'history': ?2 } }")
    void changeOrderStatus(String orderId, String status, OrderHistory history);
}
