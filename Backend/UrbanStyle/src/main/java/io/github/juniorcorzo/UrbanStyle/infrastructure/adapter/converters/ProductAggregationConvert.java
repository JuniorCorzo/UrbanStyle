package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Component;

@Component
@ReadingConverter
@RequiredArgsConstructor
public class ProductAggregationConvert implements Converter<Document, ProductAggregationDomain> {
    private final ObjectMapper objectMapper;

    @Override
    public ProductAggregationDomain convert(Document source) {
        final String productsGrouped = source.toJson();

        try {
            ProductAggregationDomain product = this.objectMapper.readValue(productsGrouped, ProductAggregationDomain.class);
            return product;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
