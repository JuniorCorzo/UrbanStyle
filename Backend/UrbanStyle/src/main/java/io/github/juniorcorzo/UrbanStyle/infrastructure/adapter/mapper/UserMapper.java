package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "password", source = "password"),
            @Mapping(target = "role", source = "role", defaultValue = "USER"),
            @Mapping(target = "phone", source = "phone"),
    })
    UserEntity toEntity(UserDTO userDto);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "role", source = "role"),
            @Mapping(target = "phone", source = "phone"),
    })
    UserDTO toDto(UserEntity userEntity);
}

