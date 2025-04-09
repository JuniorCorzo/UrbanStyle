package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mappings({
            @Mapping(target = "name", source = "userDto.name"),
            @Mapping(target = "email", source = "userDto.email"),
            @Mapping(target = "password", source = "userDto.password"),
            @Mapping(target = "role", source = "userDto.role"),
            @Mapping(target = "phone", source = "userDto.phone"),
    })
    UserEntity toEntity(UserDTO userDto);

    @Mappings({
            @Mapping(target = "id", source = "userEntity.id"),
            @Mapping(target = "name", source = "userEntity.name"),
            @Mapping(target = "email", source = "userEntity.email"),
            @Mapping(target = "role", source = "userEntity.role"),
            @Mapping(target = "phone", source = "userEntity.phone"),
    })
    UserDTO toDto(UserEntity userEntity);
}

