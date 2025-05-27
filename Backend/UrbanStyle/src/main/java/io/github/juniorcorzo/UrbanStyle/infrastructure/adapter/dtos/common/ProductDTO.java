package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategorySummary;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDTO(
        String id,
        String name,
        String description,
        List<String> images,
        double price,
        double discount,
        CategorySummary[] categories,
        AttributesDTO attributes,
        int stock
) {}

