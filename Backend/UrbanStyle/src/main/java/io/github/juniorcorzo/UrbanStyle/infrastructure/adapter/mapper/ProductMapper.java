package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "images", source = "images"),
            @Mapping(target = "price", source = "price"),
            @Mapping(target = "discount", source = "discount"),
            @Mapping(target = "categories", source = "categories"),
            @Mapping(target = "attributes", source = "attributes"),
            @Mapping(target = "stock", source = "stock")
    })
    ProductEntity toEntity(ProductDTO productDTO);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "images", source = "images"),
            @Mapping(target = "price", source = "price"),
            @Mapping(target = "discount", source = "discount"),
            @Mapping(target = "categories", source = "categories"),
            @Mapping(target = "attributes", source = "attributes"),
            @Mapping(target = "stock", source = "stock")
    })
    ProductDTO toDTO(ProductEntity productDTO);
}

