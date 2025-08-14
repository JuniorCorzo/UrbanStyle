package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.CustomerDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderWithCustomerDTO;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends ListCrudRepository<OrdersEntity, String> {
    @Query("{ 'userId': ?0 }")
    Page<OrdersEntity> findAllOrdersByUserId(String userId, Pageable pageable);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }",
            "{ $unwind: { path: '$user' } }",
            "{ $addFields: { customer: { userId: '$userId', username: '$user.name' } } }",
            "{ $unset: ['user', 'userId', '_class'] }"
    })
    List<OrderWithCustomerDTO> findAllOrdersWithCustomer();

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }",
            "{ $unwind: { path: '$user' } }",
            "{ $group: { _id: { userId: '$userId', username: '$user.name' } } }",
            "{ $project: { _id: 0, userId: '$_id.userId', username: '$_id.username' } }"
    })
    List<CustomerDTO> findALlCustomers();

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'status': ?1}, '$push': { 'history': ?2 } }")
    void changeOrderStatus(String orderId, String status, OrderHistory history);
}
