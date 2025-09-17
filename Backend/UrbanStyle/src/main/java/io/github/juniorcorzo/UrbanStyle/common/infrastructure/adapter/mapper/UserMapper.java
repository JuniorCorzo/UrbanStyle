package io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.user.infrastructure.adapter.dto.common.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mappings(value = {
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "password", source = "password"),
            @Mapping(target = "avatar", source = "avatar"),
            @Mapping(target = "role", source = "role", defaultValue = "ROLE_USER"),
            @Mapping(target = "phone", source = "phone"),
            @Mapping(target = "dataConsent", source = "dataConsent"),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true)
    })
    UserEntity toEntity(UserDTO userDto);

    @Mappings({
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "name", source = "name"),
            @Mapping(target = "email", source = "email"),
            @Mapping(target = "avatar", source = "avatar"),
            @Mapping(target = "role", source = "role"),
            @Mapping(target = "phone", source = "phone"),
            @Mapping(target = "dataConsent", source = "dataConsent"),
            @Mapping(target = "createdAt", source = "createdAt"),
            @Mapping(target = "updatedAt", source = "updatedAt")
    })
    UserDTO toDto(UserEntity userEntity);
}

