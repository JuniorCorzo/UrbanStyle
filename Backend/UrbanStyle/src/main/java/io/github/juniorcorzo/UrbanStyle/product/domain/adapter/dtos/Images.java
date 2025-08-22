package io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Images {
    private String color;
    private String image;
}
