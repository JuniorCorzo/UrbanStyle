package io.github.juniorcorzo.UrbanStyle.product.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.product.application.service.ProductImageService;
import io.github.juniorcorzo.UrbanStyle.product.application.service.ProductSearchService;
import io.github.juniorcorzo.UrbanStyle.product.application.service.ProductService;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class ProductController {
    private final ProductService productService;
    private final ProductSearchService productSearchService;
    private final ProductImageService productImageService;

    @GetMapping("/all")
    public ResponseDTO<ProductDTO> getAllProducts() {
        return this.productSearchService.getAllProducts();
    }

    @GetMapping
    public ResponseDTO<ProductDTO> getProductById(@IdFormatConstraint @RequestParam String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/group")
    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        return this.productSearchService.groupProductsByCategories();
    }

    @GetMapping("/{category}")
    public ResponseDTO<ProductDTO> getAllCategories(@NotBlank @PathVariable String category) {
        return this.productSearchService.getProductsByCategory(category);
    }

    @GetMapping("/search")
    public ResponseDTO<ProductDTO> searchProducts(@NotBlank @RequestParam String search) {
        return this.productSearchService.searchProducts(search);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductDTO> createProduct(@Validated(OnCreate.class) @Valid @RequestBody ProductDTO productDTO) {
        return this.productService.createProduct(productDTO);
    }

    @PostMapping("/add-images")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductDTO> addImages(@Valid @RequestBody ProductImagesDTO productDTO) {
        return this.productImageService.addImages(productDTO);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductDTO> updateProduct(@Validated(OnUpdate.class) @RequestBody ProductDTO productDTO) {
        return this.productService.updateProduct(productDTO);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductDTO> deleteProduct(@IdFormatConstraint @PathVariable String id) {
        return this.productService.deleteProduct(id);
    }

    @DeleteMapping("/delete-images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<ProductDTO> deleteImagesFromProduct(@Valid @RequestBody ProductImagesDTO productImagesDTO) {
        return this.productImageService.deleteImagesFromProduct(productImagesDTO);
    }
}
