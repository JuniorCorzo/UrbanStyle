package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductDTO(
    String id,
    String name,
    String description,
    String[] images,
    double price,
    double discount,
    String[] categories,
    AttributesDTO attributes,
    int stock
) {}

