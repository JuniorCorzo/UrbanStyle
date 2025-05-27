package io.github.juniorcorzo.UrbanStyle.domain.entities;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.CategorySummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "products")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductEntity {
    @MongoId
    private String id;
    @TextIndexed
    private String name;
    @TextIndexed
    private String description;
    private double price;
    private double discount;
    private List<String> images;
    @TextIndexed
    private CategorySummary[] categories;
    private Attribute attributes;
    private int stock;
}

