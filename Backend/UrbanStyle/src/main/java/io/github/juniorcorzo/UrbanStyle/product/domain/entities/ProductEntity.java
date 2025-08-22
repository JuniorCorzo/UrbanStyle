package io.github.juniorcorzo.UrbanStyle.product.domain.entities;

import io.github.juniorcorzo.UrbanStyle.category.domain.dto.CategorySummary;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.Images;
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
    private byte discount;
    private List<Images> images;
    @TextIndexed
    private List<CategorySummary> categories;
    private List<Attribute> attributes;
    private int stock;
}

