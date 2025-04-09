package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;


import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.CategoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface CategoriesMapper {
    @Mappings({
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description")
    })
    CategoryEntity toEntity(CategoryDTO categoryDTO);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "description", source = "description")
    })
    CategoryDTO toDTO(CategoryEntity categoryEntity);
}
