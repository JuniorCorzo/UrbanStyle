package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.OrderService;
import io.github.juniorcorzo.UrbanStyle.application.service.bulks.SaleProcessorService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.CustomerDTO;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderWithCustomerDTO;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.OrdersSaveDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.OrdersResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class OrderController {
    private final OrderService orderService;
    private final SaleProcessorService saleProcessorService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseDTO<OrdersResponseDTO> getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @GetMapping("/with-customer")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseDTO<OrderWithCustomerDTO> getAllOrderWithCustomer() {
        return this.orderService.getAllOrdersWithCustomer();
    }

    @GetMapping("/customers")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseDTO<CustomerDTO> getAllCustomers() {
        return this.orderService.getAllCustomers();
    }

    @GetMapping("/by")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<Page<OrdersResponseDTO>> getOrdersByUserId(
            @IdFormatConstraint
            @RequestParam("user-id")
            String userId,
            Pageable pageable
    ) {
        return this.orderService.getOrdersByUserId(userId, pageable);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<OrdersResponseDTO> createOrder(@Validated(OnCreate.class) @RequestBody OrdersSaveDTO insertOrder) {
        return this.saleProcessorService.processSale(insertOrder);
    }


    @PatchMapping("/change-status")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<OrdersResponseDTO> changeStatus(@IdFormatConstraint @RequestParam("id") String orderId, @RequestParam OrderStatus status) {
        return this.orderService.changeStatus(orderId, status);
    }

    @PatchMapping("/cancel-order")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<OrdersResponseDTO> cancelOrder(@IdFormatConstraint @RequestParam("id") String orderId) {
        return this.saleProcessorService.processCancelOrder(orderId);
    }
}
