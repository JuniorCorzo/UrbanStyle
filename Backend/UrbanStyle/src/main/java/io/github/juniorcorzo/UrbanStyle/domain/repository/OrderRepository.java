package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
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
            "{ $match: { status: 'DELIVERED' } }",
            "{ '$unwind': '$products' }",
            "{ '$group': { _id: '$products.name', 'sold': { $sum: '$products.quantity' } } }",
            "{ '$project': { '_id': 0, 'sold': 1, name: '$_id' } }",
            "{ '$sort': { sold: -1 } }",
            "{ $limit: 10 }"
    })
    List<SalesRecord> findProductsMoreSold();

    @Aggregation(
            pipeline = {
                    "{ $match: { status: 'DELIVERED' } }",
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

    @Aggregation(pipeline = {
            "{ $match: { status: 'DELIVERED' } }",
            "{ $unwind: { path: '$products' } }",
            "{ $group: { _id: { year: { $year: '$orderDate' }, month: { $month: '$orderDate' }, day: { $dayOfMonth: '$orderDate' } }, sales: { $sum: '$products.quantity' }, total: { $sum: '$total' } } }",
            "{ $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }",
            "{ $project: { _id: 0, date:  { $dateFromParts: { year: '$_id.year', month: '$_id.month', day: '$_id.day' } }, sales: 1, total: 1 } }"
    })
    List<ReportSalesDTO> reportSalesByDays();

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'status': ?1}, '$push': { 'history': ?2 } }")
    void changeOrderStatus(String orderId, String status, OrderHistory history);
}
