package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.AttributesItemsDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AttributesDTO(
        @Valid
        @Size(min = 1, message = "Color must be greater than 0", groups = {OnCreate.class, OnUpdate.class})
        List<AttributesItemsDTO> color,
        @Valid
        @Size(min = 1, message = "Size must be greater than 0", groups = {OnCreate.class, OnUpdate.class})
        List<AttributesItemsDTO> size
) {
}
