package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategorySummary;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDTO(
                @IdFormatConstraint(groups = OnUpdate.class) @IdMustExists(entity = ProductEntity.class, groups = OnUpdate.class) String id,
                @NotBlank(groups = {
                                OnCreate.class, OnUpdate.class }) String name,
                @NotBlank(groups = { OnCreate.class, OnUpdate.class }) String description,
                @NotNull(groups = OnCreate.class) @Size(min = 1, message = "Images must be provided", groups = OnCreate.class) List<ImagesDTO> images,
                @DecimalMin(value = "1000.00", message = "Price must be greater than 1000", groups = { OnCreate.class,
                                OnUpdate.class }) double price,
                @Min(value = 0, message = "Discount must be greater than or equal to 0", groups = { OnCreate.class,
                                OnUpdate.class }) @Max(value = 100, message = "Discount must be less than or equal to 100", groups = {
                                                OnCreate.class, OnUpdate.class }) byte discount,
                @Valid @NotNull(groups = { OnCreate.class,
                                OnUpdate.class }) @Size(min = 1, message = "Categories must be provided") List<CategorySummary> categories,
                @Valid @NotNull(groups = { OnCreate.class, OnUpdate.class }) List<AttributesDTO> attributes,
                @JsonProperty(access = JsonProperty.Access.READ_ONLY) int stock){
}
