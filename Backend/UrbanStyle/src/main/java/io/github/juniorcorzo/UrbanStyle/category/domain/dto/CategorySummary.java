package io.github.juniorcorzo.UrbanStyle.category.domain.dto;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.category.domain.entities.CategoryEntity;
import jakarta.validation.constraints.NotBlank;

public record CategorySummary(
        @IdFormatConstraint
        @IdMustExists(entity = CategoryEntity.class)
        String categoryId,
        @NotBlank(groups = {OnCreate.class, OnUpdate.class})
        String name
) {
}
