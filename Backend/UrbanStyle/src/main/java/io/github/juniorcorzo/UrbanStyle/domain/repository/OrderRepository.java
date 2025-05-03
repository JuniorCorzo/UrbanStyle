package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends ListCrudRepository<OrdersEntity, String> {
    @Query("{ 'userId': ?0 }")
    List<OrdersEntity> findAllOrdersByUserId(String userId);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'status': ?1}, '$push': { 'history': ?2 } }")
    void changeOrderStatus(String orderId, String status, OrderHistory history);
}
