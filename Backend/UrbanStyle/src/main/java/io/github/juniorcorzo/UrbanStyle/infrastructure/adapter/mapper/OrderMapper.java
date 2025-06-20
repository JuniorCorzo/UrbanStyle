package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.OrdersSaveDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.OrdersResponseDTO;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "products", expression = "java(shoppingCartService.getShoppingCartByUserId(ordersSaveDTO.userId()).data().getFirst().items())"),
            @Mapping(target = "status", source = "status", defaultValue = "PROCESSING"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "paymentMethod", source = "paymentMethod"),
            @Mapping(target = "orderDate", expression = "java(java.time.LocalDateTime.now())"),
            @Mapping(target = "history", ignore = true),
            @Mapping(target = "total", ignore = true)
    })
    OrdersEntity toEntity(OrdersSaveDTO ordersSaveDTO, @Context ShoppingCartService shoppingCartService);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "products", source = "products"),
            @Mapping(target = "total", source = "total"),
            @Mapping(target = "status", source = "status"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "paymentMethod", source = "paymentMethod"),
            @Mapping(target = "orderDate", source = "orderDate"),
            @Mapping(target = "history", source = "history")
    })
    OrdersResponseDTO toDTO(OrdersEntity ordersEntity);
}
