package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.application.exceptions.FailedChangeStatusInOrder;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.repository.OrderRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.OrdersDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
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

    public ResponseDTO<ReportSalesDTO> reportSales() {
        return new ResponseDTO<>(
                HttpStatus.OK,
                this.orderRepository.reportSales(),
                "Orders retrieved successfully"
        );
    }

    public ResponseDTO<OrdersDTO> createOrder(OrdersDTO insertOrder) {
        try {
            OrdersEntity orderSaved = this.orderRepository.save(this.orderMapper.toEntity(insertOrder));

            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    List.of(this.orderMapper.toDTO(orderSaved)),
                    "Order created successfully"
            );
        } catch (Exception e) {
            log.error("Error creating order", e);
            throw new SaveDocumentFailed(DocumentsName.ORDER);
        }
    }

    public ResponseDTO<OrdersDTO> updateOrder(OrdersDTO updateOrder) {
        try {
            OrdersEntity orderUpdated = this.orderRepository.save(this.orderMapper.toEntity(updateOrder));

            return new ResponseDTO<>(
                    HttpStatus.OK,
                    List.of(this.orderMapper.toDTO(orderUpdated)),
                    "Order updated successfully"
            );
        } catch (RuntimeException e) {
            log.error("Error updating order", e);
            throw new SaveDocumentFailed(DocumentsName.ORDER);
        }
    }

    public ResponseDTO<OrdersDTO> changeStatus(String orderId, OrderStatus status) {
        try {
            this.orderRepository.changeOrderStatus(
                    orderId,
                    status.toString(),
                    new OrderHistory(status, LocalDateTime.now())
            );
            OrdersEntity statusChange = this.orderRepository
                    .findById(orderId)
                    .orElseThrow(() -> new DocumentNotFound(DocumentsName.ORDER, orderId));

            return new ResponseDTO<>(
                    HttpStatus.OK,
                    List.of(this.orderMapper.toDTO(statusChange)),
                    "Order status changed successfully"
            );
        } catch (RuntimeException e) {
            log.error("Failed to change status in order with id {}", orderId, e);
            throw new FailedChangeStatusInOrder();
        }
    }

    public ResponseDTO<OrdersDTO> cancelOrder(String orderId) {
        final OrderStatus status = OrderStatus.CANCELED;
        return this.changeStatus(orderId, status);
    }
}
