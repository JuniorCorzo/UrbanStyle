package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProductDTO {
    private String id;
    private String name;
    private String description;
    private String[] images;
    private double price;
    private double discount;
    private String[] categories;
    private AttributesDTO attributes;
}

@NoArgsConstructor
@AllArgsConstructor
@Data
class AttributesDTO {
    private String color;
    private String size;
}