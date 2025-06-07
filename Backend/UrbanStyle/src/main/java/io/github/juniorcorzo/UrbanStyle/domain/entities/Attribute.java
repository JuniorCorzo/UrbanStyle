package io.github.juniorcorzo.UrbanStyle.domain.entities;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.AttributesItemsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attribute {
    private List<AttributesItemsDTO> color;
    private List<AttributesItemsDTO> size;
}
