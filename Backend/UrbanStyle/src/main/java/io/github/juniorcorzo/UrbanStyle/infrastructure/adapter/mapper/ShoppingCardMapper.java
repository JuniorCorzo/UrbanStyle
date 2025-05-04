package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.ShoppingCardEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCardDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ShoppingCardMapper {
    @Mappings({
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "items", source = "items")
    })
    ShoppingCardDTO toDTO(ShoppingCardEntity shoppingCardEntity);

    @Mappings({
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "items", source = "items")
    })
    ShoppingCardEntity toEntity(ShoppingCardDTO shoppingCardDTO);
}
