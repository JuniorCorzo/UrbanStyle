package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.OrdersEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.OrdersDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "products", source = "products"),
            @Mapping(target = "total", source = "total"),
            @Mapping(target = "address", source = "address"),
            @Mapping(target = "paymentMethod", source = "paymentMethod"),
            @Mapping(target = "orderDate", source = "orderDate"),
            @Mapping(target = "history", source = "history")
    })
    OrdersEntity toEntity(OrdersDTO ordersDTO);

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
    OrdersDTO toDTO(OrdersEntity ordersEntity);
}
