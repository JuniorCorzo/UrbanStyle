package io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos;

import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductAggregationDomain {
    private String category;
    private List<ProductDTO> products;
}
