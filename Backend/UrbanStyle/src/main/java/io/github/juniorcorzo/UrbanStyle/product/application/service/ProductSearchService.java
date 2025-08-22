package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.product.application.service.aggregations.ProductAggregationService;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.mappers.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSearchService {
    private final ProductsRepository productsRepository;
    private final ProductAggregationService productAggregationService;
    private final ProductMapper productMapper;

    public ResponseDTO<ProductDTO> getAllProducts() {
        List<ProductDTO> products = this.productsRepository
                .findAll()
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        List<ProductAggregationDomain> productsGroupedByCategories = this.productAggregationService
                .productsGroupedByCategory();

        return new ResponseDTO<>(HttpStatus.OK, productsGroupedByCategories, "Product retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryName) {
        List<ProductDTO> products = this.productsRepository.findByCategory(categoryName)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.CATEGORY, categoryName)).stream()
                .map(this.productMapper::toDTO).toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> searchProducts(String search) {
        List<ProductDTO> products = this.productsRepository
                .searchProducts(search)
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }
}
