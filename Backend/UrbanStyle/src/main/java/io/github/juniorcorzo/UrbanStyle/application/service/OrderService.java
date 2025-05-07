package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.domain.repository.OrderRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.OrdersDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public ResponseDTO<OrdersDTO> getALlOrders() {
        List<OrdersDTO> allOrders = this.orderRepository.findAll().stream().map(orderMapper::toDTO).toList();
        return new ResponseDTO<>(
                HttpStatus.OK,
                allOrders,
                "Orders retrieved successfully"
        );
    }

    public ResponseDTO<SalesRecord> getProductsMoreSold() {
        return new ResponseDTO<>(
                HttpStatus.OK,
                this.orderRepository.findProductsMoreSold(),
                "Orders retrieved successfully"
        );
    }

    public ResponseDTO<SalesRecord> getCategoryMoreSold() {
        return new ResponseDTO<>(
                HttpStatus.OK,
                this.orderRepository.findCategoriesMoreSold(),
                "Orders retrieved successfully"
        );

    }

    public ResponseDTO<OrdersDTO> getOrdersByUserId(String userId) {
        List<OrdersDTO> ordersByUser = this.orderRepository.findAllOrdersByUserId(userId)
                .stream()
                .map(orderMapper::toDTO)
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                ordersByUser,
                "Orders retrieved successfully"
        );
    }

    public ResponseDTO<OrdersDTO> createOrder(OrdersDTO insertOrder) {
        OrdersEntity orderSaved = this.orderRepository.save(this.orderMapper.toEntity(insertOrder));

        return new ResponseDTO<>(
                HttpStatus.CREATED,
                List.of(this.orderMapper.toDTO(orderSaved)),
                "Order created successfully"
        );
    }

    public ResponseDTO<OrdersDTO> updateOrder(OrdersDTO updateOrder) {
        OrdersEntity orderUpdated = this.orderRepository.save(this.orderMapper.toEntity(updateOrder));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.orderMapper.toDTO(orderUpdated)),
                "Order updated successfully"
        );
    }

    public ResponseDTO<OrdersDTO> changeStatus(String orderId, OrderStatus status) {
        this.orderRepository.changeOrderStatus(
                orderId,
                status.toString(),
                new OrderHistory(status, LocalDateTime.now())
        );
        OrdersEntity statusChange = this.orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.orderMapper.toDTO(statusChange)),
                "Order status changed successfully"
        );
    }

    public ResponseDTO<OrdersDTO> cancelOrder(String orderId) {
        final OrderStatus status = OrderStatus.CANCELED;
        this.orderRepository.changeOrderStatus(
                orderId,
                status.toString(),
                new OrderHistory(status, LocalDateTime.now())
        );
        OrdersEntity orderCanceled = this.orderRepository
                .findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.orderMapper.toDTO(orderCanceled)),
                "Order canceled successfully"
        );
    }
}
