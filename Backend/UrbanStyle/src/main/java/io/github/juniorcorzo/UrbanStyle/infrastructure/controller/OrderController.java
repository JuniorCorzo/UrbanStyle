package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.OrderService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ReportSalesDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.SalesRecord;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.OrdersSaveDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.OrdersResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/all")
    ResponseDTO<OrdersResponseDTO> getAllOrders() {
        return this.orderService.getALlOrders();
    }

    @GetMapping("/by")
    public ResponseDTO<OrdersResponseDTO> getOrdersByUserId(@RequestParam("user-id") String userId) {
        return this.orderService.getOrdersByUserId(userId);
    }

    @GetMapping("/products-most-sold")
    public ResponseDTO<SalesRecord> getProductsMoreSold() {
        return this.orderService.getProductsMoreSold();
    }

    @GetMapping("/categories-most-sold")
    public ResponseDTO<SalesRecord> getCategoryMoreSold() {
        return this.orderService.getCategoryMoreSold();
    }

    @GetMapping("/report-sales")
    public ResponseDTO<ReportSalesDTO> reportSales() {
        return this.orderService.reportSales();
    }

    @PostMapping("/create")
    public ResponseDTO<OrdersResponseDTO> createOrder(@RequestBody OrdersSaveDTO insertOrder) {
        return this.orderService.createOrder(insertOrder);
    }

    @PutMapping("/update")
    public ResponseDTO<OrdersResponseDTO> updateOrder(@RequestBody OrdersSaveDTO updateOrder) {
        return this.orderService.updateOrder(updateOrder);
    }

    @PatchMapping("/change-status")
    public ResponseDTO<OrdersResponseDTO> changeStatus(@RequestParam("id") String orderId, @RequestParam OrderStatus status) {
        return this.orderService.changeStatus(orderId, status);
    }

    @PatchMapping("/cancel-order")
    public ResponseDTO<OrdersResponseDTO> cancelOrder(@RequestParam("id") String orderId) {
        return this.orderService.cancelOrder(orderId);
    }
}
