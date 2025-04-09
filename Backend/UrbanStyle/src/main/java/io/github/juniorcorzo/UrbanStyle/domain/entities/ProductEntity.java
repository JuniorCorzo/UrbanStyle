package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "products")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductEntity {
    @MongoId
    @Setter(AccessLevel.NONE)
    private String id;
    private String name;
    private String description;
    private double price;
    private double discount;
    private String[] images;
    private String[] categories;
    private Attribute attributes;
    private int stock;
}

