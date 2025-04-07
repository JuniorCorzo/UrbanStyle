package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryDTO {
    private String id;
    private String name;
    private String description;

}
