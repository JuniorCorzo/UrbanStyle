package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.AddressEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mappings({
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "street", source = "street"),
            @Mapping(target = "city", source = "city"),
            @Mapping(target = "state", source = "state"),
            @Mapping(target = "country", source = "country"),
            @Mapping(target = "postalCode", source = "postalCode")
    })

    AddressEntity toEntity(AddressDTO address);
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "userId", source = "userId"),
            @Mapping(target = "street", source = "street"),
            @Mapping(target = "city", source = "city"),
            @Mapping(target = "state", source = "state"),
            @Mapping(target = "country", source = "country"),
            @Mapping(target = "postalCode", source = "postalCode")
    })
    AddressDTO toDTO(AddressEntity addressEntity);
}
