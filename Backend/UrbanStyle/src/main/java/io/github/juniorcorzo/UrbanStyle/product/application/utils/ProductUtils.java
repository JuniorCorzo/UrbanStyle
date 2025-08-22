package io.github.juniorcorzo.UrbanStyle.product.application.utils;

import io.github.juniorcorzo.UrbanStyle.product.domain.entities.Attribute;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class ProductUtils {
    public static int getTotalStock(List<Attribute> attributes) {
        return attributes.stream().reduce(0, (acc, attribute) -> acc + attribute.getQuantity(), Integer::sum);
    }
}
