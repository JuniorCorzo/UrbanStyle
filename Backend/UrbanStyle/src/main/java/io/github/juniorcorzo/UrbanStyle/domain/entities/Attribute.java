package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attribute {
    private String color;
    private String size;
}
