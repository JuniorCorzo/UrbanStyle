package io.github.juniorcorzo.UrbanStyle.category.infrastructure.adapter.mapper;


import io.github.juniorcorzo.UrbanStyle.category.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.category.infrastructure.adapter.dto.CategoryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface CategoriesMapper {
    @Mappings({
            @Mapping(target = "id", source = "id"),
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
