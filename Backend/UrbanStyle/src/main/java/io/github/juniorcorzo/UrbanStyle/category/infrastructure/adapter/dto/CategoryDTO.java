package io.github.juniorcorzo.UrbanStyle.category.infrastructure.adapter.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.category.domain.entities.CategoryEntity;
import jakarta.validation.constraints.NotBlank;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CategoryDTO(
        @IdFormatConstraint(groups = OnUpdate.class)
        @IdMustExists(entity = CategoryEntity.class, groups = OnUpdate.class)
        String id,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String description
) {

}
