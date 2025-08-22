package io.github.juniorcorzo.UrbanStyle.product.application.utils;

import io.github.juniorcorzo.UrbanStyle.category.domain.dto.CategorySummary;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.Attribute;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AttributesManageUtils {
    public static void setAttributesSku(final ProductEntity productEntity) {
        final String categorySku = createSku(productEntity.getCategories());
        productEntity.getAttributes().forEach((attr) -> {
            final String attributeSku = createSku(attr.getSize(), attr.getColor());
            final String sku = String.format("%s-%s", categorySku, attributeSku);
            attr.setSku(sku);
        });
    }

    public static String createSku(List<CategorySummary> categories) {
        return categories.stream()
                .filter(Predicate.not(category -> category.categoryId().equals("68a11eafe8d5abf2ff67d53b")))
                .map(CategorySummary::name)
                .map(name -> name.substring(0, 3))
                .map(String::toUpperCase)
                .collect(Collectors.joining("-"));
    }

    public static String createSku(String size, String color) {
        StringBuilder sku = new StringBuilder();
        Predicate<String> isSeparator = (str) -> str.equalsIgnoreCase("y") || str.equals(",");

        sku.append(size.toUpperCase());
        sku.append("-");
        sku.append(
                Arrays.stream(color.split(" "))
                        .filter(Predicate.not(isSeparator))
                        .map(colorFiltered -> colorFiltered.substring(0, 3))
                        .map(String::toUpperCase)
                        .collect(Collectors.joining("-")));

        return sku.toString();
    }

    public static Map<String, Attribute> toMapBySku(final List<Attribute> attributes) {
        return attributes.parallelStream()
                .collect(Collectors.toMap(Attribute::getSku, attribute -> attribute));
    }
}
