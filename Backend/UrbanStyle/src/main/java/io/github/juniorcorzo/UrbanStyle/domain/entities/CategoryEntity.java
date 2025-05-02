package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document("categories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryEntity {
    @MongoId
    private String id;
    private String name;
    private String description;
}
